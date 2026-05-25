import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { isPast, isToday, parseISO } from 'date-fns';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { Button, EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
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

function groupReminders<R extends { completed?: boolean; dueDateIso?: string }>(rows: R[]) {
  const overdue: R[] = [];
  const upcoming: R[] = [];
  const completed: R[] = [];

  rows.forEach((row) => {
    if (row.completed) {
      completed.push(row);
      return;
    }
    if (row.dueDateIso) {
      const due = parseISO(row.dueDateIso);
      if (isPast(due) && !isToday(due)) {
        overdue.push(row);
        return;
      }
    }
    upcoming.push(row);
  });

  return { overdue, upcoming, completed };
}

export function RemindersOverviewScreen({ navigation }: Props): ReactElement {
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
    return reminders.data.map((dto) => ({
      ...reminderDtoToListItem(
        dto,
        remindersApplicationSummaryFallback(
          lookup[dto.applicationId]?.jobTitle,
          lookup[dto.applicationId]?.companyName,
        ),
      ),
      dueDateIso: dto.dueDate,
    }));
  }, [reminders.data, lookup]);

  const rows = scaffold || !apiOn ? fixtureRows.map((r) => ({ ...r, dueDateIso: undefined })) : serverRows;

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

  const grouped = useMemo(() => groupReminders(rows as Array<(typeof rows)[number]>), [rows]);

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

  const openCreate = (): void => {
    if (!apiOn || scaffold) return;
    navigation.navigate('ReminderForm', {});
  };

  const openEdit = (reminderId: string): void => {
    if (!apiOn || scaffold) return;
    navigation.navigate('ReminderForm', { reminderId });
  };

  const renderSection = (
    title: string,
    items: Array<(typeof rows)[number]>,
  ): ReactElement | null => {
    if (items.length === 0) return null;
    return (
      <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        <Typography variant="label">{title}</Typography>
        {items.map((r) => (
          <ReminderCard
            key={r.id}
            reminder={r}
            onPress={apiOn && !scaffold ? () => openEdit(r.id) : undefined}
            onToggleCompletePress={() => toggle(r.id, !!r.completed)}
          />
        ))}
      </View>
    );
  };

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
        <LoadingState message="Fetching reminders…" />
      </Screen>
    );
  }

  const hasAny = rows.length > 0;

  return (
    <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero" accessibilityRole="header">
        Reminders
      </Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        {subtitle}
      </Typography>

      {apiOn && !scaffold ? (
        <Button
          label="Add reminder"
          variant="secondary"
          block
          style={{ marginTop: theme.space.lg }}
          onPress={() => openCreate()}
        />
      ) : null}

      {apiOn && reminders.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(reminders.error as Error)?.message ?? 'Reminders failed to load'}
        </Typography>
      ) : null}

      {!hasAny ? (
        <EmptyState title="No reminders yet" description="Add follow-ups linked to your applications." />
      ) : (
        <>
          {renderSection('Overdue', grouped.overdue)}
          {renderSection('Upcoming', grouped.upcoming)}
          {grouped.upcoming.length === 0 && grouped.overdue.length === 0 && !grouped.completed.length ? (
            <EmptyState title="You're caught up" description="Completed reminders appear below." />
          ) : null}
          {renderSection('Completed', grouped.completed)}
        </>
      )}
    </Screen>
  );
}
