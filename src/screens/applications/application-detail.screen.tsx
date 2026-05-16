import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { InterviewCard } from '../../components/interviews/interview-card';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { StatusBadge } from '../../components/applications/status-badge';
import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Typography,
} from '../../components/ui';
import { WORK_MODE_LABELS } from '../../constants/work-mode';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { applicationDtoToListItem } from '../../domain/application-mappers';
import { interviewDtoToListItem } from '../../domain/interview-mappers';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { reminderDtoToListItem, remindersApplicationSummaryFallback } from '../../domain/reminder-mappers';
import { formatApplicationTimelineLine } from '../../domain/timeline-format';
import { getMockApplicationById } from '../../fixtures/mock-applications';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import {
  useApplicationDetailQuery,
  useApplicationsListQuery,
  useApplicationTimelineQuery,
  useDeleteApplicationMutation,
  useInterviewsQuery,
  useRemindersQuery,
} from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationDetail'>,
  BottomTabScreenProps<BottomTabParamList>
>;

const TIMELINE_PREVIEW = ['Resume submitted', 'Recruiter screen booked', 'Take-home invite queued'];

export function ApplicationDetailScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const applicationId = route.params.applicationId;

  const appsPrefetch = useApplicationsListQuery(apiOn, {});
  const detailQuery = useApplicationDetailQuery(apiOn, applicationId);
  const remindersQuery = useRemindersQuery(apiOn);
  const interviewsQuery = useInterviewsQuery(apiOn);
  const timelineQuery = useApplicationTimelineQuery(apiOn, applicationId);
  const removeApplication = useDeleteApplicationMutation();

  const lookup = useMemo(() => buildJobSummaryLookup(appsPrefetch.data), [appsPrefetch.data]);

  const mockApp = scaffold ? getMockApplicationById(applicationId) : undefined;
  const remoteProjection = apiOn && detailQuery.data ? applicationDtoToListItem(detailQuery.data) : undefined;
  const application = scaffold ? mockApp ?? undefined : remoteProjection;

  const relatedReminders = useMemo(() => {
    if (scaffold || !apiOn) {
      return MOCK_REMINDERS.filter((r) => r.linkedApplicationId === applicationId && !r.completed);
    }
    if (!remindersQuery.data) return [];
    return remindersQuery.data
      .filter((dto) => dto.applicationId === applicationId && !dto.isCompleted)
      .map((dto) =>
        reminderDtoToListItem(
          dto,
          remindersApplicationSummaryFallback(lookup[dto.applicationId]?.jobTitle, lookup[dto.applicationId]?.companyName),
        ),
      );
  }, [apiOn, applicationId, remindersQuery.data, scaffold, lookup]);

  const relatedInterviews = useMemo(() => {
    if (scaffold || !apiOn) {
      return MOCK_INTERVIEWS.filter((i) => i.linkedApplicationId === applicationId);
    }
    if (!interviewsQuery.data) return [];
    return interviewsQuery.data
      .filter((dto) => dto.applicationId === applicationId)
      .map((dto) => interviewDtoToListItem(dto, lookup));
  }, [apiOn, applicationId, interviewsQuery.data, scaffold, lookup]);

  const timelineEntries = useMemo(() => {
    if (scaffold || !apiOn) {
      return TIMELINE_PREVIEW.map((line) => ({ key: line, text: line }));
    }
    if (!timelineQuery.data?.length) return [];
    const ordered = [...timelineQuery.data].sort(
      (a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
    );
    return ordered.map((event) => ({
      key: event.id,
      text: formatApplicationTimelineLine(event),
    }));
  }, [apiOn, scaffold, timelineQuery.data]);

  const subtitle = scaffold
    ? 'Fixture-backed detail drill'
    : apiOn
      ? 'Hydrated via GET /applications and supporting collections.'
      : 'Need EXPO_PUBLIC_API_URL configured to hydrate this drill from Nest.';

  const openInterviewContext = (): void => {
    navigation.navigate('Home', {
      screen: 'InterviewList',
      params: { linkedApplicationId: applicationId },
    });
  };

  const confirmDelete = (): void => {
    if (!apiOn) return;
    Alert.alert('Remove application?', 'This deletes the row and cascading reminders/interviews.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          removeApplication.mutate(applicationId, {
            onSuccess: () => navigation.goBack(),
            onError: (error) => {
              const normalized = parseAxiosApiError(error);
              Alert.alert('Delete failed', normalized?.message ?? 'Unexpected error.');
            },
          }),
      },
    ]);
  };

  const refreshControl = apiOn ? (
    <RefreshControl
      refreshing={Boolean(
        detailQuery.isRefetching ||
          remindersQuery.isRefetching ||
          interviewsQuery.isRefetching ||
          timelineQuery.isRefetching ||
          appsPrefetch.isRefetching,
      )}
      onRefresh={() =>
        void Promise.all([
          detailQuery.refetch(),
          remindersQuery.refetch(),
          interviewsQuery.refetch(),
          timelineQuery.refetch(),
          appsPrefetch.refetch(),
        ])
      }
    />
  ) : undefined;

  const bootLoading = apiOn && detailQuery.isPending && !detailQuery.data;

  if (bootLoading) {
    return (
      <Screen scroll refreshControl={refreshControl}>
        <LoadingState message="Loading application workspace…" />
      </Screen>
    );
  }

  if (!application) {
    return (
      <Screen scroll refreshControl={refreshControl}>
        <ErrorState
          title="Application not found"
          message={
            scaffold
              ? 'This id is absent from scaffold fixtures.'
              : (detailQuery.error as Error)?.message ?? 'Nothing returned for this id.'
          }
          retryLabel={scaffold ? 'Go back' : 'Retry'}
          onRetry={
            scaffold
              ? () => navigation.goBack()
              : () =>
                  void Promise.all([
                    detailQuery.refetch(),
                    timelineQuery.refetch(),
                    remindersQuery.refetch(),
                    interviewsQuery.refetch(),
                  ])
          }
        />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refreshControl}>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.xs }}>
        Application
      </Typography>
      <Typography variant="bodySmall" muted>
        {subtitle}
      </Typography>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: theme.space.md,
          marginTop: theme.space.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="hero">{application.companyName}</Typography>
          <Typography variant="subtitle" muted style={{ marginTop: theme.space.xs }}>
            {application.jobTitle}
          </Typography>
        </View>
        <StatusBadge status={application.status} />
      </View>

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
        <Typography variant="label">Overview</Typography>
        <Typography variant="body">{WORK_MODE_LABELS[application.workMode]}</Typography>
        {application.location ? (
          <Typography variant="bodySmall" muted>
            {application.location}
          </Typography>
        ) : null}
        {application.salaryRange ? (
          <Typography variant="bodySmall" color={theme.colors.accent}>
            {application.salaryRange}
          </Typography>
        ) : null}
        {application.appliedLabel ? (
          <Typography variant="caption" muted>
            {application.appliedLabel}
          </Typography>
        ) : null}
        {application.deadlineLabel ? (
          <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.warning }}>
            {application.deadlineLabel}
          </Typography>
        ) : null}
      </Card>

      {application.notesPreview ? (
        <Card style={{ marginTop: theme.space.md, gap: theme.space.sm }}>
          <Typography variant="label">Notes preview</Typography>
          <Typography variant="bodySmall">{application.notesPreview}</Typography>
        </Card>
      ) : null}

      <Card style={{ marginTop: theme.space.md, gap: theme.space.sm }}>
        <Typography variant="label">Timeline</Typography>
        {timelineEntries.map((entry) => (
          <Typography key={entry.key} variant="caption" muted>
            · {entry.text}
          </Typography>
        ))}
      </Card>

      {relatedReminders.length > 0 ? (
        <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="label">Related reminders</Typography>
          {relatedReminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </View>
      ) : null}

      {relatedInterviews.length > 0 ? (
        <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="label">Interviews</Typography>
          {relatedInterviews.map((i) => (
            <InterviewCard key={i.id} interview={i} />
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: theme.space.xl, gap: theme.space.sm }}>
        <Button
          label="Update status"
          variant="primary"
          block
          onPress={() =>
            navigation.navigate('UpdateApplicationStatus', { applicationId })
          }
        />
        <Button
          label="Add timeline note"
          variant="secondary"
          block
          onPress={() => navigation.navigate('AddTimelineNote', { applicationId })}
        />
        <Button label="Interview context (Home tab)" variant="outline" block onPress={openInterviewContext} />
        {apiOn ? (
          <Button
            label={removeApplication.isPending ? 'Deleting…' : 'Delete application'}
            variant="outline"
            block
            disabled={removeApplication.isPending}
            onPress={() => confirmDelete()}
          />
        ) : null}
      </View>
    </Screen>
  );
}
