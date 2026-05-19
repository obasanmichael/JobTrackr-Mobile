import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { ConnectivityBanner } from '../components/ConnectivityBanner';
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
      <ConnectivityBanner />
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <AppErrorBoundary>
        <RootNavigator />
      </AppErrorBoundary>
    </NavigationContainer>
  );
}
