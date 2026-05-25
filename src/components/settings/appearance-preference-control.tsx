import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Typography } from '../ui';
import { useAppTheme, type ThemePreference } from '../../theme';

const OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

type Props = {
  preference?: ThemePreference;
  onPreferenceChange?: (preference: ThemePreference) => void;
};

/**
 * Matches system appearance or fixes light/dark mode.
 */
export function AppearancePreferenceControl(props: Props = {}): ReactElement {
  const { preference: controlledPreference, onPreferenceChange } = props;
  const { theme, preference: contextPreference, setPreference: setContextPreference } =
    useAppTheme();
  const preference = controlledPreference ?? contextPreference;
  const setPreference = onPreferenceChange ?? setContextPreference;

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
