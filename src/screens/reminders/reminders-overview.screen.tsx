import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import type { RemindersStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<RemindersStackParamList, 'RemindersOverview'>;

export function RemindersOverviewScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const [reminders, setReminders] = useState(() => MOCK_REMINDERS.map((r) => ({ ...r })));

  const toggle = useCallback((id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  }, []);

  const openItems = reminders.filter((r) => !r.completed);

  return (
    <Screen scroll>
      <Typography variant="hero">Reminders</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Tap the checkbox to simulate completion · persists until reload during UI-only phase.
      </Typography>

      {openItems.length === 0 ? (
        <EmptyState title="You're caught up" description="Completed reminders stay visible below once we wire archive UX." />
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
          {openItems.map((r) => (
            <ReminderCard key={r.id} reminder={r} onToggleCompletePress={() => toggle(r.id)} />
          ))}
        </View>
      )}

      <Typography variant="label" style={{ marginTop: theme.space.xxl }}>
        Completed (fixture preview)
      </Typography>
      <View style={{ marginTop: theme.space.sm, gap: theme.space.md }}>
        {reminders
          .filter((r) => r.completed)
          .map((r) => (
            <ReminderCard key={r.id} reminder={r} onToggleCompletePress={() => toggle(r.id)} />
          ))}
      </View>
    </Screen>
  );
}
