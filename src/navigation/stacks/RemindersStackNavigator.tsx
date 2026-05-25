import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { RemindersOverviewScreen } from '../../screens/reminders/reminders-overview.screen';
import { ReminderFormScreen } from '../../screens/reminders/reminder-form.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import {
  nestedStackScreenOptions,
  TAB_ROOT_TITLES,
} from '../stack-screen-options';
import type { RemindersStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<RemindersStackParamList>();
const remindersBack = TAB_ROOT_TITLES.Reminders;

export function RemindersStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="RemindersOverview">
        <Stack.Screen name="RemindersOverview" component={RemindersOverviewScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="ReminderForm"
          component={ReminderFormScreen}
          options={({ route }) =>
            nestedStackScreenOptions(route.params.reminderId ? 'Edit reminder' : 'New reminder', remindersBack)
          }
        />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
