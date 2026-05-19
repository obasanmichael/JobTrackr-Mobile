import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { AddTimelineNoteScreen } from '../../screens/applications/add-timeline-note.screen';
import { ApplicationDetailScreen } from '../../screens/applications/application-detail.screen';
import { ApplicationListScreen } from '../../screens/applications/application-list.screen';
import { EditApplicationScreen } from '../../screens/applications/edit-application.screen';
import { UpdateApplicationStatusScreen } from '../../screens/applications/update-application-status.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import type { ApplicationsStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<ApplicationsStackParamList>();

export function ApplicationsStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="ApplicationList">
        {/* Tab root: Applications list owns the page chrome */}
        <Stack.Screen name="ApplicationList" component={ApplicationListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} options={{ title: 'Application' }} />
        <Stack.Screen name="EditApplication" component={EditApplicationScreen} options={{ title: 'Edit application' }} />
        <Stack.Screen name="UpdateApplicationStatus" component={UpdateApplicationStatusScreen} options={{ title: 'Update status' }} />
        <Stack.Screen name="AddTimelineNote" component={AddTimelineNoteScreen} options={{ title: 'Add note' }} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
