import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { AddTimelineNoteScreen } from '../../screens/applications/add-timeline-note.screen';
import { ApplicationDetailScreen } from '../../screens/applications/application-detail.screen';
import { ApplicationListScreen } from '../../screens/applications/application-list.screen';
import { EditApplicationScreen } from '../../screens/applications/edit-application.screen';
import { UpdateApplicationStatusScreen } from '../../screens/applications/update-application-status.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import {
  nestedStackScreenOptions,
  tabRootScreenOptions,
  TAB_ROOT_TITLES,
} from '../stack-screen-options';
import type { ApplicationsStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<ApplicationsStackParamList>();

export function ApplicationsStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();
  const appsBack = TAB_ROOT_TITLES.Applications;

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="ApplicationList">
        <Stack.Screen
          name="ApplicationList"
          component={ApplicationListScreen}
          options={tabRootScreenOptions(appsBack)}
        />
        <Stack.Screen
          name="ApplicationDetail"
          component={ApplicationDetailScreen}
          options={nestedStackScreenOptions('Application', appsBack)}
        />
        <Stack.Screen
          name="EditApplication"
          component={EditApplicationScreen}
          options={nestedStackScreenOptions('Edit application', appsBack)}
        />
        <Stack.Screen
          name="UpdateApplicationStatus"
          component={UpdateApplicationStatusScreen}
          options={nestedStackScreenOptions('Update status', appsBack)}
        />
        <Stack.Screen
          name="AddTimelineNote"
          component={AddTimelineNoteScreen}
          options={nestedStackScreenOptions('Add note', appsBack)}
        />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
