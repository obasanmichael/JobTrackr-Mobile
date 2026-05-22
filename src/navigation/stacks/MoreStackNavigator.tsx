import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { BillingScreen } from '../../screens/profile/billing.screen';
import { LegalInformationScreen } from '../../screens/profile/legal-information.screen';
import { CalendarScreen } from '../../screens/profile/calendar.screen';
import { DesignReferenceScreen } from '../../screens/profile/design-reference.screen';
import { MatchedJobsScreen } from '../../screens/profile/matched-jobs.screen';
import { JobDetailScreen } from '../../screens/home/job-detail.screen';
import { SubmitCareersPageScreen } from '../../screens/profile/submit-careers-page.screen';
import { MoreHubScreen } from '../../screens/profile/more-hub.screen';
import { ResumeDetailScreen } from '../../screens/profile/resume-detail.screen';
import { ResumeOverviewScreen } from '../../screens/profile/resume-overview.screen';
import { SettingsScreen } from '../../screens/profile/settings.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import {
  nestedStackScreenOptions,
  tabRootScreenOptions,
  TAB_ROOT_TITLES,
} from '../stack-screen-options';
import type { MoreStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<MoreStackParamList>();

const moreBack = TAB_ROOT_TITLES.More;

/** More hub (Discover parity) · Settings · resume & placeholder routes formerly under Profile. */
export function MoreStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="MoreHub">
        <Stack.Screen
          name="MoreHub"
          component={MoreHubScreen}
          options={tabRootScreenOptions(moreBack)}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={nestedStackScreenOptions('Settings', moreBack)}
        />
        <Stack.Screen
          name="LegalInformation"
          component={LegalInformationScreen}
          options={nestedStackScreenOptions('Privacy legal', moreBack)}
        />
        <Stack.Screen
          name="DesignReference"
          component={DesignReferenceScreen}
          options={nestedStackScreenOptions('Gallery', moreBack)}
        />
        <Stack.Screen
          name="ResumeOverview"
          component={ResumeOverviewScreen}
          options={nestedStackScreenOptions('Resume', moreBack)}
        />
        <Stack.Screen
          name="ResumeDetail"
          component={ResumeDetailScreen}
          options={nestedStackScreenOptions('Resume details', 'Resume')}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={nestedStackScreenOptions('Calendar', moreBack)}
        />
        <Stack.Screen
          name="BillingPlaceholder"
          component={BillingScreen}
          options={nestedStackScreenOptions('Billing', moreBack)}
        />
        <Stack.Screen
          name="MatchedJobs"
          component={MatchedJobsScreen}
          options={nestedStackScreenOptions('Matched jobs', moreBack)}
        />
        <Stack.Screen
          name="SubmitCareersPage"
          component={SubmitCareersPageScreen}
          options={nestedStackScreenOptions('Submit careers page', moreBack)}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetailScreen}
          options={nestedStackScreenOptions('Job details', 'Matched jobs')}
        />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
