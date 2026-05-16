import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Typography } from '../ui';
import { useAppTheme, type ThemePreference } from '../../theme';

const OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'Auto' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

/**
 * Matches system appearance or fixes light/dark mode.
 */
export function AppearancePreferenceControl(): ReactElement {
  const { theme, preference, setPreference } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: theme.colors.surface,
        padding: theme.space.xs,
        borderRadius: theme.radii.pill,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
      }}
      accessibilityRole="radiogroup"
    >
      {OPTIONS.map(({ key, label }) => {
        const active = preference === key;
        return (
          <Pressable
            key={key}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => setPreference(key)}
            style={{
              paddingVertical: theme.space.sm,
              paddingHorizontal: theme.space.lg,
              borderRadius: theme.radii.pill,
              backgroundColor: active ? theme.colors.accentMuted : 'transparent',
            }}
          >
            <Typography variant="caption" color={active ? theme.colors.accent : theme.colors.textSecondary}>
              {label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
