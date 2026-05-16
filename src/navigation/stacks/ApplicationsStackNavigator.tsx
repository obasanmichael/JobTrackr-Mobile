import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { AddTimelineNoteScreen } from '../../screens/applications/add-timeline-note.screen';
import { ApplicationDetailScreen } from '../../screens/applications/application-detail.screen';
import { ApplicationListScreen } from '../../screens/applications/application-list.screen';
import { EditApplicationScreen } from '../../screens/applications/edit-application.screen';
import { UpdateApplicationStatusScreen } from '../../screens/applications/update-application-status.screen';
import type { ApplicationsStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<ApplicationsStackParamList>();

export function ApplicationsStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ApplicationList">
        <Stack.Screen name="ApplicationList" component={ApplicationListScreen} />
        <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
        <Stack.Screen name="EditApplication" component={EditApplicationScreen} />
        <Stack.Screen name="UpdateApplicationStatus" component={UpdateApplicationStatusScreen} />
        <Stack.Screen name="AddTimelineNote" component={AddTimelineNoteScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
