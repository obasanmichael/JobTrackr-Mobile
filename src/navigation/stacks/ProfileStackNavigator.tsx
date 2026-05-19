import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { BillingPlaceholderScreen } from '../../screens/profile/billing-placeholder.screen';
import { CalendarPlaceholderScreen } from '../../screens/profile/calendar-placeholder.screen';
import { DesignReferenceScreen } from '../../screens/profile/design-reference.screen';
import { MatchedJobsPlaceholderScreen } from '../../screens/profile/matched-jobs-placeholder.screen';
import { ProfileOverviewScreen } from '../../screens/profile/profile-overview.screen';
import { ResumeDetailScreen } from '../../screens/profile/resume-detail.screen';
import { ResumeOverviewScreen } from '../../screens/profile/resume-overview.screen';
import type { ProfileStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileOverview">
        <Stack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
        <Stack.Screen name="DesignReference" component={DesignReferenceScreen} />
        <Stack.Screen name="ResumeOverview" component={ResumeOverviewScreen} />
        <Stack.Screen name="ResumeDetail" component={ResumeDetailScreen} />
        <Stack.Screen name="CalendarPlaceholder" component={CalendarPlaceholderScreen} />
        <Stack.Screen name="BillingPlaceholder" component={BillingPlaceholderScreen} />
        <Stack.Screen name="MatchedJobsPlaceholder" component={MatchedJobsPlaceholderScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
