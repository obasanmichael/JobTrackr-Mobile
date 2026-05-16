import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { CalendarClock } from 'lucide-react-native';
import type { ReminderListItem } from '../../domain/reminder-display';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { useAppTheme } from '../../theme';

type Props = {
  reminder: ReminderListItem;
  onPress?: () => void;
  onToggleCompletePress?: () => void;
};

export function ReminderCard({ reminder, onPress, onToggleCompletePress }: Props): ReactElement {
  const { theme } = useAppTheme();
  const muted = reminder.completed;

  const inner = (
    <Card
      style={{
        gap: theme.space.sm,
        opacity: muted ? 0.72 : 1,
        borderColor: muted ? theme.colors.borderMuted : theme.colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', gap: theme.space.md }}>
        <CalendarClock color={muted ? theme.colors.textMuted : theme.colors.accent} size={22} strokeWidth={2} />
        <View style={{ flex: 1 }}>
          <Typography variant="subtitle" style={muted ? { textDecorationLine: 'line-through' } : undefined}>
            {reminder.title}
          </Typography>
          <Typography variant="caption" muted style={{ marginTop: theme.space.xs }}>
            {reminder.dueLabel}
          </Typography>
          {reminder.linkedApplicationSummary ? (
            <Typography variant="caption" muted style={{ marginTop: theme.space.xs }}>
              {reminder.linkedApplicationSummary}
            </Typography>
          ) : null}
        </View>
        {onToggleCompletePress ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!reminder.completed }}
            hitSlop={8}
            onPress={onToggleCompletePress}
            style={{
              width: 26,
              height: 26,
              borderRadius: theme.radii.sm,
              borderWidth: 2,
              borderColor: reminder.completed ? theme.colors.accent : theme.colors.border,
              backgroundColor: reminder.completed ? theme.colors.accentMuted : 'transparent',
            }}
          />
        ) : null}
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}
