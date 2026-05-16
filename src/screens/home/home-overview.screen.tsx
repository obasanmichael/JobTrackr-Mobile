import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { ApplicationCard } from '../../components/applications/application-card';
import { InterviewCard } from '../../components/interviews/interview-card';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { Button, Card, LoadingState, Screen, Typography } from '../../components/ui';
import { MOCK_APPLICATION_ENTITY_ID } from '../../constants/mock-navigation';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { applicationDtoToListItem } from '../../domain/application-mappers';
import { dashboardInterviewSliceToItem } from '../../domain/interview-mappers';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { dashboardReminderSliceToItem } from '../../domain/reminder-mappers';
import { MOCK_APPLICATIONS } from '../../fixtures/mock-applications';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import {
  useApplicationsListQuery,
  useDashboardSummaryQuery,
} from '../../query/jt-queries';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeOverview'>;

export function HomeOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();

  const dash = useDashboardSummaryQuery(apiOn);
  const appsAll = useApplicationsListQuery(apiOn, {});

  const lookup = useMemo(() => buildJobSummaryLookup(appsAll.data), [appsAll.data]);

  const nextInterview = useMemo(() => {
    if (!apiOn) return MOCK_INTERVIEWS[0];
    const first = dash.data?.upcomingInterviews[0];
    if (!first) return undefined;
    return dashboardInterviewSliceToItem(first, lookup);
  }, [apiOn, dash.data?.upcomingInterviews, lookup]);

  const nextReminder = useMemo(() => {
    if (!apiOn) return MOCK_REMINDERS.find((r) => !r.completed);
    const first = dash.data?.upcomingReminders[0];
    if (!first) return undefined;
    return dashboardReminderSliceToItem(first, lookup);
  }, [apiOn, dash.data?.upcomingReminders, lookup]);

  const recentApps = useMemo(() => {
    if (!apiOn) return MOCK_APPLICATIONS.slice(0, 2);
    return appsAll.data?.slice(0, 2).map(applicationDtoToListItem) ?? [];
  }, [apiOn, appsAll.data]);

  const activeApplications = apiOn ? (dash.data?.activeApplications ?? 0) : MOCK_APPLICATIONS.length;

  const dueSoonCount = apiOn
    ? (dash.data?.upcomingReminders.length ?? 0)
    : MOCK_REMINDERS.filter((r) => !r.completed).length;

  const subtitle = scaffold
    ? 'Fixture dashboard · scaffold bypass.'
    : apiOn
      ? 'Live dashboard from GET /dashboard/summary (cached locally).'
      : 'Signed in · set EXPO_PUBLIC_API_URL to load dashboard data over the REST API.';

  const boot = apiOn && dash.isPending && appsAll.isPending;

  const refresh = (
    <RefreshControl
      refreshing={Boolean(apiOn && (dash.isRefetching || appsAll.isRefetching))}
      onRefresh={() => void Promise.all([dash.refetch(), appsAll.refetch()])}
    />
  );

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh}>
        <LoadingState message="Loading dashboard snapshot..." />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refresh}>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.xs }}>
        Good afternoon
      </Typography>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle" muted>
        {subtitle}
      </Typography>

      {apiOn && (dash.isError || appsAll.isError) ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.md }}>
          {[dash.error, appsAll.error].filter(Boolean).map((err) => (err as Error).message).join(' · ') ||
            'Request failed'}
        </Typography>
      ) : null}

      <View style={{ flexDirection: 'row', gap: theme.space.md, marginTop: theme.space.xl }}>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.space.md }}>
          <Typography variant="hero">{activeApplications}</Typography>
          <Typography variant="caption" muted>
            Active pipelines
          </Typography>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.space.md }}>
          <Typography variant="hero">{dueSoonCount}</Typography>
          <Typography variant="caption" muted>
            Upcoming dues
          </Typography>
        </Card>
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Next interview
      </Typography>
      <View style={{ marginTop: theme.space.sm }}>
        {nextInterview ? <InterviewCard interview={nextInterview} /> : (
          <Typography variant="caption" muted>No upcoming interviews on file.</Typography>
        )}
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Next reminder
      </Typography>
      <View style={{ marginTop: theme.space.sm }}>
        {nextReminder ? <ReminderCard reminder={nextReminder} /> : (
          <Typography variant="caption" muted>No reminders due ahead.</Typography>
        )}
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Recent applications
      </Typography>
      <View style={{ marginTop: theme.space.sm, gap: theme.space.md }}>
        {recentApps.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </View>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.sm }}>
        <Button label="All interviews" variant="secondary" block onPress={() => navigation.navigate('InterviewList', {})} />
        {scaffold ? (
          <Button
            label="Interviews for scaffold fixture"
            variant="outline"
            block
            onPress={() =>
              navigation.navigate('InterviewList', { linkedApplicationId: MOCK_APPLICATION_ENTITY_ID })
            }
          />
        ) : null}
      </View>
    </Screen>
  );
}
