import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { RemindersOverviewScreen } from '../../screens/reminders/reminders-overview.screen';
import type { RemindersStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<RemindersStackParamList>();

export function RemindersStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RemindersOverview">
        <Stack.Screen name="RemindersOverview" component={RemindersOverviewScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
