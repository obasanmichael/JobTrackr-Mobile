import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Human-readable titles used for native back buttons (not route names). */
export const TAB_ROOT_TITLES = {
  Home: 'Home',
  Applications: 'Applications',
  QuickAdd: 'Quick add',
  Reminders: 'Reminders',
  More: 'More',
} as const;

export function tabRootScreenOptions(title: string): NativeStackNavigationOptions {
  return {
    headerShown: false,
    title,
  };
}

export function nestedStackScreenOptions(
  title: string,
  backTitle: string,
): NativeStackNavigationOptions {
  return {
    title,
    headerBackTitle: backTitle,
  };
}
