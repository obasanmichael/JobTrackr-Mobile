import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { BillingPlaceholderScreen } from '../../screens/profile/billing-placeholder.screen';
import { LegalInformationScreen } from '../../screens/profile/legal-information.screen';
import { CalendarPlaceholderScreen } from '../../screens/profile/calendar-placeholder.screen';
import { DesignReferenceScreen } from '../../screens/profile/design-reference.screen';
import { MatchedJobsScreen } from '../../screens/profile/matched-jobs.screen';
import { MoreHubScreen } from '../../screens/profile/more-hub.screen';
import { ResumeDetailScreen } from '../../screens/profile/resume-detail.screen';
import { ResumeOverviewScreen } from '../../screens/profile/resume-overview.screen';
import { SettingsScreen } from '../../screens/profile/settings.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import type { MoreStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<MoreStackParamList>();

/** More hub (Discover parity) · Settings · resume & placeholder routes formerly under Profile. */
export function MoreStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="MoreHub">
        {/* Tab root: hero + sections — avoid stacking with native “More” title */}
        <Stack.Screen name="MoreHub" component={MoreHubScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="LegalInformation" component={LegalInformationScreen} options={{ title: 'Privacy legal' }} />
        <Stack.Screen name="DesignReference" component={DesignReferenceScreen} options={{ title: 'Gallery' }} />
        <Stack.Screen name="ResumeOverview" component={ResumeOverviewScreen} options={{ title: 'Resume' }} />
        <Stack.Screen name="ResumeDetail" component={ResumeDetailScreen} options={{ title: 'Resume details' }} />
        <Stack.Screen name="CalendarPlaceholder" component={CalendarPlaceholderScreen} options={{ title: 'Calendar' }} />
        <Stack.Screen name="BillingPlaceholder" component={BillingPlaceholderScreen} options={{ title: 'Billing' }} />
        <Stack.Screen name="MatchedJobs" component={MatchedJobsScreen} options={{ title: 'Matched jobs' }} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
