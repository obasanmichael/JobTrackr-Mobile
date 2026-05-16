import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../config/ui-scaffold';
import { useAuthStore } from '../store/auth.store';
import type { RootStackParamList } from './types';
import { AppBottomTabsNavigator } from './AppBottomTabsNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useAppTheme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Routes: auth stack vs signed-in tabs. Scaffolding can bypass JWT for UI QA (see ui-scaffold).
 */
export function RootNavigator(): ReactElement {
  const { theme } = useAppTheme();
  const bypass = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);

  const showAppShell = bypass || user !== null;
  const gatedReady = bypass || hasHydrated;

  if (!gatedReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator key={showAppShell ? 'app' : 'auth'} screenOptions={{ headerShown: false }}>
      {showAppShell ? (
        <Stack.Screen name="SignedInTabs" component={AppBottomTabsNavigator} />
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
