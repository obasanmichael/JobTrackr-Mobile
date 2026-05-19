import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarCheck,
  FileText,
  GitCommitHorizontal,
  MessageSquare,
  Phone,
  Search,
  Trophy,
  TrendingUp,
  XCircle,
} from 'lucide-react-native';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ApplicationCard } from '../../components/applications/application-card';
import { APPLICATION_STATUS_CHART_FG } from '../../constants/application-status-colors';
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from '../../constants/application-status';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { applicationDtoToListItem } from '../../domain/application-mappers';
import { formatApplicationTimelineLine } from '../../domain/timeline-format';
import type { ApplicationEventDto } from '../../types/application-event.dto';
import type { ApplicationEventType } from '../../constants/application-event-type';
import { EVENT_TYPES } from '../../constants/application-event-type';
import type { DashboardSummaryDto } from '../../types/dashboard.dto';
import { MOCK_APPLICATIONS } from '../../fixtures/mock-applications';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { BottomTabParamList } from '../../navigation/types';
import type { HomeStackParamList } from '../../navigation/types';
import { useApplicationsListQuery, useDashboardSummaryQuery } from '../../query/jt-queries';
import { Button, Card, LoadingState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';

const ACTIVE_PIPELINE: Set<ApplicationStatus> = new Set([
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'TECHNICAL_ASSESSMENT',
  'FINAL_INTERVIEW',
]);

const EVENT_ICON: Partial<Record<string, LucideIcon>> = {
  STATUS_CHANGE: GitCommitHorizontal,
  NOTE: MessageSquare,
  RECRUITER_UPDATE: Phone,
  INTERVIEW_UPDATE: CalendarCheck,
  GENERAL_UPDATE: FileText,
  REMINDER_CREATED: Bell,
};

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeOverview'>,
  BottomTabScreenProps<BottomTabParamList>
>;

function dueLabel(dateStr: string): { text: string; urgent: boolean } {
  try {
    const d = parseISO(dateStr);
    if (Number.isNaN(+d)) return { text: format(parseISO(dateStr), 'MMM d'), urgent: false };
    if (isToday(d)) return { text: 'Today', urgent: true };
    if (isTomorrow(d)) return { text: 'Tomorrow', urgent: false };
    return { text: format(d, 'MMM d'), urgent: false };
  } catch {
    return { text: 'Soon', urgent: false };
  }
}

/** Fixture snapshot so scaffold mode mirrors dashboard layout shape. */
function buildFixtureSummary(): DashboardSummaryDto {
  const applicationsByStatus: Record<string, number> = {};
  for (const s of APPLICATION_STATUSES) applicationsByStatus[s] = 0;
  for (const a of MOCK_APPLICATIONS) {
    applicationsByStatus[a.status] = (applicationsByStatus[a.status] ?? 0) + 1;
  }
  const offerCount = applicationsByStatus.OFFER ?? 0;
  const rejectionCount = applicationsByStatus.REJECTED ?? 0;
  const activeApplications = MOCK_APPLICATIONS.reduce(
    (n, a) => n + (ACTIVE_PIPELINE.has(a.status) ? 1 : 0),
    0,
  );

  return {
    totalApplications: MOCK_APPLICATIONS.length,
    activeApplications,
    offerCount,
    rejectionCount,
    applicationsByStatus,
    upcomingReminders: MOCK_REMINDERS.filter((r) => !r.completed).map((r, i) => ({
      id: r.id,
      applicationId: r.linkedApplicationId ?? `fixture-${i}`,
      title: r.title,
      dueDate: new Date(Date.now() + (i + 1) * 86_400_000).toISOString(),
    })),
    upcomingInterviews: MOCK_INTERVIEWS.map((inv, i) => ({
      id: inv.id,
      applicationId: inv.linkedApplicationId ?? `fixture-int-${i}`,
      stage: 'Interview',
      interviewType: 'VIDEO',
      scheduledAt: new Date(Date.now() + (i + 2) * 86_400_000).toISOString(),
    })),
    recentEvents: [],
  };
}

function dashboardEventToTimelineDto(ev: DashboardSummaryDto['recentEvents'][number]): ApplicationEventDto {
  const raw = (ev.type ?? 'GENERAL_UPDATE').toUpperCase();
  const type: ApplicationEventType = (EVENT_TYPES as readonly string[]).includes(raw)
    ? (raw as ApplicationEventType)
    : 'GENERAL_UPDATE';

  return {
    id: ev.id,
    userId: '',
    applicationId: ev.applicationId,
    type,
    title: ev.title,
    description: ev.description,
    createdAt: ev.createdAt,
  };
}

type StatTileProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBubble: string;
  sub?: string;
  onPress?: () => void;
};

function DashboardStatTile({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBubble,
  sub,
  onPress,
}: StatTileProps): ReactElement {
  const { theme } = useAppTheme();
  const body = (
    <Card style={{ flex: 1, minHeight: 108 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.sm }}>
        <View style={{ flex: 1 }}>
          <Typography variant="label" style={{ letterSpacing: 1 }}>
            {label}
          </Typography>
          <Typography variant="hero" style={{ marginTop: theme.space.sm }}>
            {value}
          </Typography>
          {sub ? (
            <Typography variant="caption" muted style={{ marginTop: theme.space.xs }}>
              {sub}
            </Typography>
          ) : null}
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.radii.md,
            backgroundColor: iconBubble,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={iconColor} strokeWidth={2} />
        </View>
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable style={{ flex: 1 }} onPress={onPress} accessibilityRole="button">
        {body}
      </Pressable>
    );
  }
  return body;
}

function CompactRow(props: {
  dotColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const row = (
    <View style={{ flexDirection: 'row', gap: theme.space.sm, alignItems: 'flex-start' }}>
      <View
        style={{
          marginTop: 6,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: props.dotColor,
        }}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="bodySmall" numberOfLines={2} style={{ fontWeight: '600' }}>
          {props.title}
        </Typography>
        <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 2 }}>
          {props.subtitle}
        </Typography>
      </View>
    </View>
  );
  return props.onPress ? (
    <Pressable accessibilityRole="button" onPress={props.onPress}>
      {row}
    </Pressable>
  ) : (
    row
  );
}

export function HomeOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();

  const dash = useDashboardSummaryQuery(apiOn);
  const appsAll = useApplicationsListQuery(apiOn, {});

  const lookup = useMemo(() => buildJobSummaryLookup(appsAll.data), [appsAll.data]);

  const fixtureSummary = useMemo(() => buildFixtureSummary(), []);

  const summary: DashboardSummaryDto | null = scaffold && !apiOn ? fixtureSummary : apiOn ? (dash.data ?? null) : null;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const reminderRowsCompact = useMemo(() => {
    if (!summary) return [];
    if (!apiOn && scaffold) {
      return MOCK_REMINDERS.filter((r) => !r.completed).slice(0, 5).map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: [r.dueLabel, r.linkedApplicationSummary].filter(Boolean).join(' · ') || 'Reminder',
        urgent: false as const,
      }));
    }
    return summary.upcomingReminders.slice(0, 5).map((r) => {
      const due = dueLabel(r.dueDate);
      const company =
        lookup[r.applicationId]?.companyName ??
        appsAll.data?.find((a) => a.id === r.applicationId)?.companyName;
      const sub = `${due.text}${company ? ` · ${company}` : ''}`;
      return { id: r.id, title: r.title, subtitle: sub, urgent: due.urgent };
    });
  }, [apiOn, appsAll.data, lookup, scaffold, summary]);

  const interviewRowsCompact = useMemo(() => {
    if (!summary) return [];
    if (!apiOn && scaffold) {
      return MOCK_INTERVIEWS.slice(0, 5).map((i) => ({
        id: i.id,
        title: i.companyName,
        subtitle: `${i.roleTitle} · ${i.startLabel}`,
      }));
    }
    return summary.upcomingInterviews.slice(0, 5).map((iv) => ({
      id: iv.id,
      title: lookup[iv.applicationId]?.companyName ?? 'Interview',
      subtitle: (() => {
          try {
            const d = parseISO(iv.scheduledAt);
            const when = Number.isNaN(+d) ? iv.scheduledAt : format(d, 'EEE MMM d · h:mm a');
            return `${iv.stage} · ${when}${lookup[iv.applicationId]?.jobTitle ? ` · ${lookup[iv.applicationId]?.jobTitle}` : ''}`;
          } catch {
            return `${iv.stage}`;
          }
        })(),
    }));
  }, [apiOn, lookup, scaffold, summary]);

  const statusBreakdown = useMemo(() => {
    if (!summary) return [];
    const total = Math.max(summary.totalApplications, 1);
    const rows = APPLICATION_STATUSES.map((s) => ({
      status: s,
      count: summary.applicationsByStatus[s] ?? 0,
      pct: ((summary.applicationsByStatus[s] ?? 0) / total) * 100,
      fg: APPLICATION_STATUS_CHART_FG[s],
    })).filter((r) => r.count > 0);
    rows.sort((a, b) => b.count - a.count);
    return rows;
  }, [summary]);

  const activityRows = useMemo(() => {
    if (!summary?.recentEvents?.length) return [];
    return [...summary.recentEvents]
      .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
      .slice(0, 6)
      .map((ev) => ({
        ...ev,
        line: formatApplicationTimelineLine(dashboardEventToTimelineDto(ev)),
        Icon: EVENT_ICON[ev.type] ?? FileText,
      }));
  }, [summary?.recentEvents]);

  const recentApps = useMemo(() => {
    if (!apiOn) return MOCK_APPLICATIONS.slice(0, 2);
    return appsAll.data?.slice(0, 2).map(applicationDtoToListItem) ?? [];
  }, [apiOn, appsAll.data]);

  const navAppsList = (): void => {
    navigation.navigate('Applications', { screen: 'ApplicationList' });
  };
  const navQuickAdd = (): void => navigation.navigate('QuickAdd', { screen: 'QuickAddApplication' });
  const navInterviewsFull = (): void => navigation.navigate('InterviewList', {});
  const navRemindersFull = (): void => navigation.navigate('Reminders', { screen: 'RemindersOverview' });
  const navJobsBoard = (): void => navigation.navigate('JobSearch');
  const navResumeWorkspace = (): void => navigation.navigate('Profile', { screen: 'ResumeOverview' });

  const subtitle = scaffold
    ? 'Showing sample data for layout preview.'
    : apiOn
      ? "Here's your job-search snapshot."
      : 'Sign in once JobTrackr is connected to sync your dashboard.';

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
        <LoadingState message="Loading dashboard…" />
      </Screen>
    );
  }

  const primaryMuted = `${theme.colors.accent}18`;
  const blueTint = `${'#3b82f6'}${theme.mode === 'dark' ? '35' : '18'}`;
  const emeraldTint = `${'#22c55e'}${theme.mode === 'dark' ? '35' : '18'}`;
  const redTint = `${'#ef4444'}${theme.mode === 'dark' ? '35' : '18'}`;

  const isEmpty = !!(summary && summary.totalApplications === 0);

  return (
    <Screen scroll refreshControl={refresh}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.space.md }}>
        <View style={{ flex: 1 }}>
          <Typography variant="subtitle" muted>
            {greeting}
          </Typography>
          <Typography variant="hero" style={{ marginTop: theme.space.xs }}>
            Dashboard
          </Typography>
          <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
            {subtitle}
          </Typography>
        </View>
        <Button label="Quick add" variant="primary" onPress={navQuickAdd} style={{ alignSelf: 'flex-start', minHeight: 40, paddingHorizontal: theme.space.md }} />
      </View>

      {apiOn && (dash.isError || appsAll.isError) ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.md }}>
          {[dash.error, appsAll.error].filter(Boolean).map((err) => (err as Error).message).join(' · ') ||
            'Request failed'}
        </Typography>
      ) : null}

      {summary === null ? (
        <Card style={{ marginTop: theme.space.xl, paddingVertical: theme.space.lg }}>
          <Typography variant="title">Connect JobTrackr</Typography>
          <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
            {!apiOn && !scaffold
              ? 'Configure the JobTrackr server URL for this build, reopen the app, then sign in.'
              : 'We couldn’t refresh your dashboard. Pull to retry or check your connection.'}
          </Typography>
        </Card>
      ) : isEmpty && apiOn ? (
        <Card style={{ marginTop: theme.space.xl, alignItems: 'center', gap: theme.space.md, paddingVertical: theme.space.xxl, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.borderMuted }}>
          <Briefcase color={theme.colors.accent} size={32} strokeWidth={1.5} />
          <Typography variant="title" style={{ textAlign: 'center' }}>
            Start tracking your search
          </Typography>
          <Typography variant="bodySmall" muted style={{ textAlign: 'center', maxWidth: 280 }}>
            Add your first application and this dashboard fills with totals, timelines, and insights.
          </Typography>
          <Button label="Quick add first application" variant="primary" onPress={navQuickAdd} />
        </Card>
      ) : (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginTop: theme.space.lg }}>
            <View style={{ width: '48%', flexGrow: 1 }}>
              <DashboardStatTile
                label="Total"
                value={summary.totalApplications}
                icon={Briefcase}
                iconColor={theme.colors.accent}
                iconBubble={primaryMuted}
                sub={`${summary.activeApplications} active`}
                onPress={navAppsList}
              />
            </View>
            <View style={{ width: '48%', flexGrow: 1 }}>
              <DashboardStatTile
                label="In progress"
                value={summary.activeApplications}
                icon={TrendingUp}
                iconColor="#3b82f6"
                iconBubble={blueTint}
              />
            </View>
            <View style={{ width: '48%', flexGrow: 1 }}>
              <DashboardStatTile
                label="Offers"
                value={summary.offerCount}
                icon={Trophy}
                iconColor="#22c55e"
                iconBubble={emeraldTint}
              />
            </View>
            <View style={{ width: '48%', flexGrow: 1 }}>
              <DashboardStatTile
                label="Rejected"
                value={summary.rejectionCount}
                icon={XCircle}
                iconColor="#ef4444"
                iconBubble={redTint}
              />
            </View>
          </View>

          <Card style={{ marginTop: theme.space.lg }}>
            <Typography variant="label" style={{ marginBottom: theme.space.md }}>
              Discover & refine
            </Typography>
            <Pressable
              accessibilityRole="button"
              onPress={navJobsBoard}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: theme.space.sm,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm, flex: 1, paddingRight: theme.space.md }}
              >
                <Search size={18} color={theme.colors.textMuted} strokeWidth={2} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                    Browse job listings
                  </Typography>
                  <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>
                    Search aggregated roles synced with Desktop → Discover.
                  </Typography>
                </View>
              </View>
              <ArrowRight size={16} color={theme.colors.textMuted} strokeWidth={2} />
            </Pressable>
            <View style={{ height: 1, backgroundColor: theme.colors.borderMuted, marginVertical: theme.space.xs }} />
            <Pressable
              accessibilityRole="button"
              onPress={navResumeWorkspace}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: theme.space.sm,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm, flex: 1, paddingRight: theme.space.md }}
              >
                <FileText size={18} color={theme.colors.textMuted} strokeWidth={2} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                    Manage resumes
                  </Typography>
                  <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>
                    Mirrors Desktop → Improve → Resume once uploads are wired to your workspace.
                  </Typography>
                </View>
              </View>
              <ArrowRight size={16} color={theme.colors.textMuted} strokeWidth={2} />
            </Pressable>
          </Card>

          <Card style={{ marginTop: theme.space.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.space.md }}>
              <Typography variant="label">Status breakdown</Typography>
              <Pressable accessibilityRole="button" onPress={navAppsList} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Typography variant="caption" color={theme.colors.textMuted}>
                  View all
                </Typography>
                <ArrowRight size={14} color={theme.colors.textMuted} strokeWidth={2} />
              </Pressable>
            </View>
            {statusBreakdown.length === 0 ? (
              <Typography variant="caption" muted>
                Breakdown fills after you sync applications from the workspace.
              </Typography>
            ) : (
              <View style={{ gap: theme.space.md }}>
                {statusBreakdown.map((row) => (
                  <View key={row.status} style={{ gap: theme.space.xs }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography variant="caption" style={{ fontWeight: '600' }}>
                        {STATUS_LABELS[row.status]}
                      </Typography>
                      <Typography variant="caption" muted>{`${row.count}`}</Typography>
                    </View>
                    <View style={{ height: 8, borderRadius: 999, overflow: 'hidden', backgroundColor: theme.colors.borderMuted }}>
                      <View style={{ height: '100%', width: `${Math.max(4, row.pct)}%`, borderRadius: 999, backgroundColor: row.fg }} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <View style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
            <Card style={{ gap: theme.space.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: theme.space.sm, alignItems: 'center' }}>
                  <Bell size={18} color={theme.colors.textMuted} strokeWidth={2} />
                  <Typography variant="label">Reminders</Typography>
                </View>
                <Pressable accessibilityRole="button" onPress={navRemindersFull}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Typography variant="caption" color={theme.colors.textMuted}>
                      View all
                    </Typography>
                    <ArrowRight size={14} color={theme.colors.textMuted} />
                  </View>
                </Pressable>
              </View>
              <View style={{ gap: theme.space.md, marginTop: theme.space.sm }}>
                {reminderRowsCompact.length === 0 ? (
                  <Typography variant="caption" muted>
                    Nothing due soon · add reminders from reminders tab.
                  </Typography>
                ) : (
                  reminderRowsCompact.map((r) => {
                    const row = r as { id: string; title: string; subtitle: string; urgent?: boolean };
                    const dot =
                      apiOn && row.urgent === true ? theme.colors.danger : row.urgent === false ? '#F59E0B' : theme.colors.accent;
                    return <CompactRow key={row.id} dotColor={dot} title={row.title} subtitle={row.subtitle} />;
                  })
                )}
              </View>
            </Card>

            <Card style={{ gap: theme.space.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: theme.space.sm, alignItems: 'center' }}>
                  <CalendarCheck size={18} color={theme.colors.textMuted} strokeWidth={2} />
                  <Typography variant="label">Interviews</Typography>
                </View>
                <Pressable accessibilityRole="button" onPress={navInterviewsFull}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Typography variant="caption" color={theme.colors.textMuted}>
                      View all
                    </Typography>
                    <ArrowRight size={14} color={theme.colors.textMuted} />
                  </View>
                </Pressable>
              </View>
              <View style={{ gap: theme.space.md, marginTop: theme.space.sm }}>
                {interviewRowsCompact.length === 0 ? (
                  <Typography variant="caption" muted>
                    Scheduled interviews appear here automatically.
                  </Typography>
                ) : (
                  interviewRowsCompact.map((r) => (
                    <CompactRow key={r.id} dotColor={theme.colors.accent} title={r.title} subtitle={r.subtitle} />
                  ))
                )}
              </View>
            </Card>

            <Card style={{ gap: theme.space.sm }}>
              <Typography variant="label">Recent activity</Typography>
              <View style={{ gap: theme.space.md, marginTop: theme.space.sm }}>
                {!activityRows.length ? (
                  <Typography variant="caption" muted>
                    Timeline events show up once you capture notes or update statuses.
                  </Typography>
                ) : (
                  activityRows.map(({ id, Icon, line }) => (
                    <View key={id} style={{ flexDirection: 'row', gap: theme.space.sm }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: theme.colors.borderMuted,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 2,
                        }}
                      >
                        <Icon size={16} color={theme.colors.textMuted} strokeWidth={2} />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" style={{ fontWeight: '500' }}>
                          {line}
                        </Typography>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </Card>
          </View>

          <Typography variant="label" style={{ marginTop: theme.space.xl }}>
            Recent applications
          </Typography>
          <View style={{ marginTop: theme.space.sm, gap: theme.space.md }}>
            {recentApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onPress={() =>
                  navigation.navigate('Applications', {
                    screen: 'ApplicationDetail',
                    params: { applicationId: app.id },
                  })
                }
              />
            ))}
          </View>

          <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
            <Button label="Browse all applications" variant="secondary" block onPress={navAppsList} />
            <Button label="Browse interviews" variant="outline" block onPress={navInterviewsFull} />
          </View>
        </>
      )}
    </Screen>
  );
}
