import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { RemindersOverviewScreen } from '../../screens/reminders/reminders-overview.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import type { RemindersStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<RemindersStackParamList>();

export function RemindersStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="RemindersOverview">
        {/* Tab root: list uses its own page header */}
        <Stack.Screen name="RemindersOverview" component={RemindersOverviewScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
