import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { HomeOverviewScreen } from '../../screens/home/home-overview.screen';
import { InterviewListScreen } from '../../screens/home/interview-list.screen';
import { InterviewFormScreen } from '../../screens/interviews/interview-form.screen';
import { JobSearchScreen } from '../../screens/home/jobs-search.screen';
import { JobDetailScreen } from '../../screens/home/job-detail.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import {
  nestedStackScreenOptions,
  tabRootScreenOptions,
  TAB_ROOT_TITLES,
} from '../stack-screen-options';
import type { HomeStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();
  const homeBack = TAB_ROOT_TITLES.Home;

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="HomeOverview">
        <Stack.Screen
          name="HomeOverview"
          component={HomeOverviewScreen}
          options={tabRootScreenOptions(homeBack)}
        />
        <Stack.Screen
          name="InterviewList"
          component={InterviewListScreen}
          options={nestedStackScreenOptions('Interviews', homeBack)}
        />
        <Stack.Screen
          name="InterviewForm"
          component={InterviewFormScreen}
          options={({ route }) =>
            nestedStackScreenOptions(route.params.interviewId ? 'Edit interview' : 'Log interview', homeBack)
          }
        />
        <Stack.Screen
          name="JobSearch"
          component={JobSearchScreen}
          options={nestedStackScreenOptions('Jobs', homeBack)}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetailScreen}
          options={nestedStackScreenOptions('Job details', 'Jobs')}
        />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
