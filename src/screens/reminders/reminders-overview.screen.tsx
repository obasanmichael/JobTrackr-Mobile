import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { reminderDtoToListItem, remindersApplicationSummaryFallback } from '../../domain/reminder-mappers';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { RemindersStackParamList } from '../../navigation/types';
import {
  useApplicationsListQuery,
  useRemindersQuery,
  useToggleReminderMutation,
} from '../../query/jt-queries';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<RemindersStackParamList, 'RemindersOverview'>;

export function RemindersOverviewScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const [fixtureRows, setFixtureRows] = useState(() => MOCK_REMINDERS.map((r) => ({ ...r })));

  const apps = useApplicationsListQuery(apiOn, {});
  const reminders = useRemindersQuery(apiOn);
  const toggleReminder = useToggleReminderMutation();

  const lookup = useMemo(() => buildJobSummaryLookup(apps.data), [apps.data]);

  const serverRows = useMemo(() => {
    if (!reminders.data?.length) return [];
    return reminders.data.map((dto) =>
      reminderDtoToListItem(
        dto,
        remindersApplicationSummaryFallback(
          lookup[dto.applicationId]?.jobTitle,
          lookup[dto.applicationId]?.companyName,
        ),
      ),
    );
  }, [reminders.data, lookup]);

  const rows = scaffold || !apiOn ? fixtureRows : serverRows;

  const toggleLocal = useCallback((id: string) => {
    setFixtureRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    );
  }, []);

  const toggle = useCallback(
    (id: string, completed: boolean): void => {
      if (!apiOn) toggleLocal(id);
      else toggleReminder.mutate({ id, isCompleted: !completed });
    },
    [apiOn, toggleLocal, toggleReminder],
  );

  const openItems = rows.filter((r) => !r.completed);
  const closedItems = rows.filter((r) => r.completed);

  const subtitle = scaffold
    ? 'Tap to try completing reminders locally.'
    : apiOn
      ? 'Synced with reminders on your JobTrackr account.'
      : 'Showing local preview reminders until your account connects.';

  const refresh = (
    <RefreshControl
      refreshing={Boolean(apiOn && (reminders.isRefetching || apps.isRefetching))}
      onRefresh={() => void Promise.all([reminders.refetch(), apps.refetch()])}
    />
  );

  const boot = apiOn && reminders.isPending;

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
        <LoadingState message="Fetching reminders…" />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero" accessibilityRole="header">
        Reminders
      </Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        {subtitle}
      </Typography>

      {apiOn && reminders.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(reminders.error as Error)?.message ?? 'Reminders failed to load'}
        </Typography>
      ) : null}

      {openItems.length === 0 ? (
        <EmptyState title="You're caught up" description="Completed reminders sit below." />
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
          {openItems.map((r) => (
            <ReminderCard key={r.id} reminder={r} onToggleCompletePress={() => toggle(r.id, !!r.completed)} />
          ))}
        </View>
      )}

      <Typography variant="label" style={{ marginTop: theme.space.xxl }}>
        Completed
      </Typography>
      <View style={{ marginTop: theme.space.sm, gap: theme.space.md }}>
        {closedItems.map((r) => (
          <ReminderCard key={r.id} reminder={r} onToggleCompletePress={() => toggle(r.id, !!r.completed)} />
        ))}
      </View>
    </Screen>
  );
}
