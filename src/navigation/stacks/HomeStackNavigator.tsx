import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { HomeOverviewScreen } from '../../screens/home/home-overview.screen';
import { InterviewListScreen } from '../../screens/home/interview-list.screen';
import { JobSearchScreen } from '../../screens/home/jobs-search.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import type { HomeStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="HomeOverview">
        {/* Tab root: hide native header so we don’t duplicate the in-screen Dashboard title */}
        <Stack.Screen name="HomeOverview" component={HomeOverviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InterviewList" component={InterviewListScreen} options={{ title: 'Interviews' }} />
        <Stack.Screen name="JobSearch" component={JobSearchScreen} options={{ title: 'Jobs' }} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
