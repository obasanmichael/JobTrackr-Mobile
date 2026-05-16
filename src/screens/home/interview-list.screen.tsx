import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { InterviewCard } from '../../components/interviews/interview-card';
import { EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { interviewDtoToListItem } from '../../domain/interview-mappers';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { HomeStackParamList } from '../../navigation/types';
import { useApplicationsListQuery, useInterviewsQuery } from '../../query/jt-queries';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'InterviewList'>;

export function InterviewListScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const linked = route.params.linkedApplicationId;

  const apps = useApplicationsListQuery(apiOn, {});
  const interviews = useInterviewsQuery(apiOn);

  const lookup = useMemo(() => buildJobSummaryLookup(apps.data), [apps.data]);

  const remoteRows = useMemo(() => {
    if (!interviews.data?.length) return [];
    let rows = interviews.data.map((dto) => interviewDtoToListItem(dto, lookup));
    if (linked) rows = rows.filter((r) => r.linkedApplicationId === linked);
    return rows;
  }, [interviews.data, lookup, linked]);

  const fixtureRows = useMemo(() => {
    if (!linked) return MOCK_INTERVIEWS;
    return MOCK_INTERVIEWS.filter((i) => i.linkedApplicationId === linked);
  }, [linked]);

  const rows = scaffold || !apiOn ? fixtureRows : remoteRows;

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

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh}>
        <LoadingState message="Loading interviews…" />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refresh}>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Interviews
      </Typography>
      <Typography variant="subtitle" muted>
        {subtitle}
      </Typography>
      <Typography
        variant="caption"
        color={linked ? theme.colors.accent : theme.colors.textMuted}
        style={{ marginTop: theme.space.sm }}
      >
        {filterHint}
      </Typography>

      {apiOn && interviews.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(interviews.error as Error)?.message ?? 'Interviews failed to load'}
        </Typography>
      ) : null}

      <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        {rows.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No interviews scheduled"
            description={
              linked ? 'Nothing linked to this role yet.' : 'Scheduled interviews appear here after you add them.'
            }
          />
        ) : (
          rows.map((i) => <InterviewCard key={i.id} interview={i} />)
        )}
      </View>
    </Screen>
  );
}
