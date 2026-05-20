import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Linking, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Sparkles, Target } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import type { BottomTabParamList, HomeStackParamList } from '../../navigation/types';
import { jobDetailToCreateApplicationPayload } from '../../domain/job-to-application';
import { findBookmarkForJobListingId, isBookmarkRowActive } from '../../domain/saved-jobs';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import {
  useConvertSavedJobMutation,
  useCreateApplicationMutation,
  useJobDetailQuery,
  useJobMatchQuery,
  useSavedJobsBookmarksQuery,
  useToggleSavedJobBookmarkMutation,
} from '../../query/jt-queries';
import { jtKeys } from '../../query/query-keys';
import { migrateLegacySavedJobIdsOnce } from '../../services/saved-jobs-migration';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  Typography,
} from '../../components/ui';
import { useAppTheme } from '../../theme';
import { parseAxiosApiError } from '../../services/api';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'JobDetail'>,
  BottomTabScreenProps<BottomTabParamList>
>;

function formatLabel(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function JobDetailScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();
  const queryClient = useQueryClient();
  const jobId = route.params.jobId;
  const migrationRan = useRef(false);

  const bookmarksQuery = useSavedJobsBookmarksQuery(apiOn);
  const bookmarkRow = useMemo(
    () => findBookmarkForJobListingId(bookmarksQuery.data?.items ?? [], jobId),
    [bookmarksQuery.data?.items, jobId],
  );
  const saved = isBookmarkRowActive(bookmarkRow);

  const jobQuery = useJobDetailQuery(apiOn, jobId);
  const matchQuery = useJobMatchQuery(apiOn && Boolean(jobQuery.data), jobId);
  const trackCreateMutation = useCreateApplicationMutation();
  const convertMutation = useConvertSavedJobMutation();
  const toggleSaveMutation = useToggleSavedJobBookmarkMutation();

  useEffect(() => {
    if (!apiOn || migrationRan.current) {
      return;
    }
    migrationRan.current = true;
    void migrateLegacySavedJobIdsOnce().then(() =>
      queryClient.invalidateQueries({ queryKey: jtKeys.savedJobsBookmarks() }),
    );
  }, [apiOn, queryClient]);

  const onToggleSave = useCallback(() => {
    toggleSaveMutation.mutate({ jobListingId: jobId, existingRow: bookmarkRow });
  }, [bookmarkRow, jobId, toggleSaveMutation]);

  const onTrackApplication = useCallback(() => {
    if (!jobQuery.data) {
      return;
    }
    if (bookmarkRow?.status === 'CONVERTED_TO_APPLICATION' && bookmarkRow.convertedApplicationId) {
      navigation.navigate('Applications', {
        screen: 'ApplicationDetail',
        params: { applicationId: bookmarkRow.convertedApplicationId },
      });
      return;
    }
    if (bookmarkRow?.status === 'SAVED') {
      convertMutation.mutate(bookmarkRow.id, {
        onSuccess: (res) => {
          navigation.navigate('Applications', {
            screen: 'ApplicationDetail',
            params: { applicationId: res.application.id },
          });
        },
      });
      return;
    }
    trackCreateMutation.mutate(jobDetailToCreateApplicationPayload(jobQuery.data), {
      onSuccess: (application) => {
        navigation.navigate('Applications', {
          screen: 'ApplicationDetail',
          params: { applicationId: application.id },
        });
      },
    });
  }, [bookmarkRow, convertMutation, jobQuery.data, navigation, trackCreateMutation]);

  const trackPending =
    trackCreateMutation.isPending || convertMutation.isPending;

  if (!apiOn) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <EmptyState
          title="Sign in required"
          description="Connect your account to view job details from the API."
        />
      </Screen>
    );
  }

  if (jobQuery.isPending) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <LoadingState message="Loading job…" />
      </Screen>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    const errMessage =
      jobQuery.error instanceof Error
        ? jobQuery.error.message
        : parseAxiosApiError(jobQuery.error)?.message ?? 'Request failed';
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ErrorState message={errMessage} onRetry={() => void jobQuery.refetch()} retryLabel="Retry" />
      </Screen>
    );
  }

  const job = jobQuery.data;
  const match = matchQuery.data;
  const salaryParts = [job.salaryMin, job.salaryMax]
    .map((value) => (value != null ? value.toLocaleString() : null))
    .filter(Boolean)
    .join(' – ');
  const salaryLabel = salaryParts ? `${salaryParts}${job.currency ? ` ${job.currency}` : ''}` : null;
  const postedLabel = job.postedAt
    ? format(parseISO(job.postedAt), 'MMM d, yyyy')
    : null;

  const trackLabel =
    bookmarkRow?.status === 'CONVERTED_TO_APPLICATION' && bookmarkRow.convertedApplicationId
      ? 'View application'
      : trackPending
        ? 'Adding…'
        : 'Track as application';

  return (
    <Screen scroll keyboardAvoiding edges={['left', 'right', 'bottom']}>
      <View style={{ gap: theme.space.lg }}>
        <View style={{ gap: theme.space.xs }}>
          <Typography variant="subtitle">{job.title}</Typography>
          <Typography variant="bodySmall" muted>
            {job.companyName}
          </Typography>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm }}>
          <Button
            label={saved ? 'Saved' : 'Save job'}
            variant="outline"
            onPress={onToggleSave}
            disabled={toggleSaveMutation.isPending || bookmarksQuery.isPending}
            style={{ minHeight: 40 }}
          />
          {job.applyUrl ? (
            <Button
              label="View posting"
              variant="outline"
              onPress={() => void Linking.openURL(job.applyUrl as string).catch(() => undefined)}
              style={{ minHeight: 40 }}
            />
          ) : null}
        </View>

        <Card style={{ gap: theme.space.sm }}>
          {job.location ? (
            <Typography variant="caption" muted>
              {job.location}
            </Typography>
          ) : null}
          {job.workMode ? (
            <Typography variant="caption" muted>
              {formatLabel(job.workMode)}
            </Typography>
          ) : null}
          {job.experienceLevel ? (
            <Typography variant="caption" muted>
              {formatLabel(job.experienceLevel)}
            </Typography>
          ) : null}
          {job.sourceMeta ? (
            <Typography variant="caption" muted>
              Source: {job.sourceMeta.name} ({formatLabel(job.sourceMeta.type)})
            </Typography>
          ) : job.source ? (
            <Typography variant="caption" muted>
              Source: {job.source}
            </Typography>
          ) : null}
          {salaryLabel ? (
            <Typography variant="caption" muted>
              {salaryLabel}
            </Typography>
          ) : null}
          {postedLabel ? (
            <Typography variant="caption" muted>
              Posted {postedLabel}
            </Typography>
          ) : null}
        </Card>

        {matchQuery.isPending ? (
          <LoadingState message="Loading match score…" />
        ) : match?.requiresProfile ? (
          <Card style={{ gap: theme.space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
              <Sparkles size={16} color={theme.colors.accent} />
              <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                AI match
              </Typography>
            </View>
            <Typography variant="caption" muted>
              Upload and parse a resume to see how well this role fits your profile.
            </Typography>
            <Button
              label="Go to resume"
              variant="secondary"
              onPress={() =>
                navigation.navigate('More', {
                  screen: 'ResumeOverview',
                })
              }
              style={{ alignSelf: 'flex-start', minHeight: 40 }}
            />
          </Card>
        ) : match ? (
          <Card style={{ gap: theme.space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
                <Target size={16} color={theme.colors.accent} />
                <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                  Match score
                </Typography>
              </View>
              <Typography variant="bodySmall" style={{ fontWeight: '700', color: theme.colors.accent }}>
                {match.overallScore}
              </Typography>
            </View>
            <Typography variant="caption" muted>
              {match.matchReason}
            </Typography>
            {match.matchedSkills.length > 0 ? (
              <Typography variant="caption" muted numberOfLines={3}>
                Matched: {match.matchedSkills.join(', ')}
              </Typography>
            ) : null}
            {match.missingSkills.length > 0 ? (
              <Typography variant="caption" muted numberOfLines={3}>
                Gaps: {match.missingSkills.join(', ')}
              </Typography>
            ) : null}
          </Card>
        ) : null}

        {job.description ? (
          <Card style={{ gap: theme.space.sm }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
              Description
            </Typography>
            <Typography variant="caption" muted>
              {job.description}
            </Typography>
          </Card>
        ) : null}

        {job.requirements ? (
          <Card style={{ gap: theme.space.sm }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
              Requirements
            </Typography>
            <Typography variant="caption" muted>
              {job.requirements}
            </Typography>
          </Card>
        ) : null}

        <Button
          label={trackLabel}
          variant="primary"
          hapticOnPress
          disabled={
            trackPending ||
            (bookmarkRow?.status === 'CONVERTED_TO_APPLICATION' &&
              !bookmarkRow.convertedApplicationId)
          }
          onPress={onTrackApplication}
        />
      </View>
    </Screen>
  );
}
