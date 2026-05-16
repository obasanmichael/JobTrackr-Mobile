import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import type { Theme as NavTheme } from '@react-navigation/native';
import type { Theme as AppTheme } from '../../theme/types';

export function createNavigationTheme(appTheme: AppTheme): NavTheme {
  const base = appTheme.mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: appTheme.colors.accent,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      text: appTheme.colors.textPrimary,
      border: appTheme.colors.border,
      notification: appTheme.colors.accent,
    },
  };
}
