import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { isFuture, isToday, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react-native';
import { InterviewCard } from '../../components/interviews/interview-card';
import { Button, EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { interviewDtoToListItem } from '../../domain/interview-mappers';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { HomeStackParamList } from '../../navigation/types';
import { useApplicationsListQuery, useInterviewsQuery } from '../../query/jt-queries';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'InterviewList'>;

function groupInterviews<R extends { scheduledAtIso?: string }>(rows: R[]) {
  const upcoming: R[] = [];
  const past: R[] = [];

  rows.forEach((row) => {
    if (!row.scheduledAtIso) {
      upcoming.push(row);
      return;
    }
    const when = parseISO(row.scheduledAtIso);
    if (isFuture(when) || isToday(when)) upcoming.push(row);
    else past.push(row);
  });

  return { upcoming, past };
}

export function InterviewListScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const linked = route.params?.linkedApplicationId;

  const apps = useApplicationsListQuery(apiOn, {});
  const interviews = useInterviewsQuery(apiOn);

  const lookup = useMemo(() => buildJobSummaryLookup(apps.data), [apps.data]);

  const remoteRows = useMemo(() => {
    if (!interviews.data?.length) return [];
    let rows = interviews.data.map((dto) => ({
      ...interviewDtoToListItem(dto, lookup),
      scheduledAtIso: dto.scheduledAt,
    }));
    if (linked) rows = rows.filter((r) => r.linkedApplicationId === linked);
    return rows;
  }, [interviews.data, lookup, linked]);

  const fixtureRows = useMemo(() => {
    if (!linked) return MOCK_INTERVIEWS.map((i) => ({ ...i, scheduledAtIso: undefined }));
    return MOCK_INTERVIEWS.filter((i) => i.linkedApplicationId === linked).map((i) => ({
      ...i,
      scheduledAtIso: undefined,
    }));
  }, [linked]);

  const rows = scaffold || !apiOn ? fixtureRows : remoteRows;
  const grouped = useMemo(() => groupInterviews(rows as Array<(typeof rows)[number]>), [rows]);

  const subtitle = scaffold
    ? 'Sample appointments for preview.'
    : apiOn
      ? 'Interview details stay in sync with your account.'
      : 'Showing sample interviews until your account connects.';

  const filterHint = linked
    ? lookup[linked]
      ? `Filtered to interviews for ${lookup[linked]?.companyName ?? 'this role'}.`
      : 'Filtered to interviews for one application.'
    : 'All interviews';

  const refresh = (
    <RefreshControl
      refreshing={Boolean(apiOn && (interviews.isRefetching || apps.isRefetching))}
      onRefresh={() => void Promise.all([interviews.refetch(), apps.refetch()])}
    />
  );

  const boot = apiOn && interviews.isPending;

  const openCreate = (): void => {
    if (!apiOn || scaffold) return;
    navigation.navigate('InterviewForm', {
      applicationId: linked,
    });
  };

  const openEdit = (interviewId: string): void => {
    if (!apiOn || scaffold) return;
    navigation.navigate('InterviewForm', { interviewId });
  };

  const renderSection = (
    title: string,
    items: Array<(typeof rows)[number]>,
  ): ReactElement | null => {
    if (items.length === 0) return null;
    return (
      <View style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <Typography variant="label">{title}</Typography>
        {items.map((i) => (
          <InterviewCard
            key={i.id}
            interview={i}
            onPress={apiOn && !scaffold ? () => openEdit(i.id) : undefined}
          />
        ))}
      </View>
    );
  };

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh} edges={['left', 'right', 'bottom']}>
        <LoadingState message="Loading interviews…" />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refresh} edges={['left', 'right', 'bottom']}>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.sm }}>
        {subtitle}
      </Typography>
      <Typography
        variant="caption"
        color={linked ? theme.colors.accent : theme.colors.textMuted}
        style={{ marginTop: theme.space.sm }}
      >
        {filterHint}
      </Typography>

      {apiOn && !scaffold ? (
        <Button
          label="Log interview"
          variant="secondary"
          block
          style={{ marginTop: theme.space.lg }}
          onPress={() => openCreate()}
        />
      ) : null}

      {apiOn && interviews.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(interviews.error as Error)?.message ?? 'Interviews failed to load'}
        </Typography>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No interviews scheduled"
          description={
            linked ? 'Nothing linked to this role yet.' : 'Scheduled interviews appear here after you add them.'
          }
        />
      ) : (
        <View style={{ marginTop: theme.space.md }}>
          {renderSection('Upcoming', grouped.upcoming)}
          {renderSection('Past', grouped.past)}
        </View>
      )}
    </Screen>
  );
}
