import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { InterviewListScreen } from '../../screens/home/interview-list.screen';
import { HomeOverviewScreen } from '../../screens/home/home-overview.screen';
import type { HomeStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeOverview">
        <Stack.Screen name="HomeOverview" component={HomeOverviewScreen} />
        <Stack.Screen name="InterviewList" component={InterviewListScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
