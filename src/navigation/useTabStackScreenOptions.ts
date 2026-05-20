import { useMemo } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { useAppTheme } from '../theme';

/**
 * Native stack chrome for screens inside bottom tabs — provides platform back buttons
 * while keeping visuals aligned with JobTrackr tokens.
 */
export function useTabStackScreenOptions(): NativeStackNavigationOptions {
  const { theme } = useAppTheme();

  return useMemo(
    () => ({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: theme.colors.surfaceElevated,
      },
      headerTintColor: theme.colors.accent,
      headerTitleStyle: {
        color: theme.colors.textPrimary,
        fontWeight: '600',
        fontSize: 17,
      },
      headerBackTitleVisible: false,
      headerBackTitle: 'Back',
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme.colors.accent, theme.colors.background, theme.colors.surfaceElevated, theme.colors.textPrimary],
  );
}
