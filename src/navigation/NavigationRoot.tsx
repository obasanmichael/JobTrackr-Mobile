import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from '../theme';
import { createNavigationTheme } from './theme/create-navigation-theme';
import { RootNavigator } from './RootNavigator';

/**
 * Holds NavigationContainer theme sync + status chrome.
 * Kept apart from navigator trees so route files remain declarative.
 */
export function NavigationRoot(): ReactElement {
  const { theme, resolvedMode } = useAppTheme();
  const navTheme = useMemo(() => createNavigationTheme(theme), [theme]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}
