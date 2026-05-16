import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../config/ui-scaffold';
import type { RootStackParamList } from './types';
import { AppBottomTabsNavigator } from './AppBottomTabsNavigator';
import { AuthNavigator } from './AuthNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Top-level authenticated vs onboarding split.
 *
 * Replace `initialRouteName` selection with persisted session validation when wiring auth.
 */
export function RootNavigator(): ReactElement {
  const initialRouteName = UI_SCAFFOLD_BYPASS_AUTHENTICATION ? 'SignedInTabs' : 'AuthFlow';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      <Stack.Screen name="SignedInTabs" component={AppBottomTabsNavigator} />
    </Stack.Navigator>
  );
}
