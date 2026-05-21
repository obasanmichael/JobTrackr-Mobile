import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Calendar, CreditCard, FileText, Globe, Search, Settings, Sparkles } from 'lucide-react-native';
import { Card, HubNavRow, Screen, Typography } from '../../components/ui';
import type { BottomTabParamList, MoreStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHub'>;

/** Discover / Improve parity + account settings — surfaced from More instead of burying Discover under Settings. */
export function MoreHubScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();

  const navJobsBoard = (): void => {
    const tabNav = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    tabNav?.navigate('Home', { screen: 'JobSearch' });
  };

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="title" accessibilityRole="header">
        Discover & workspaces
      </Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Discover tools and workspace pages that complement your daily Track tab flow.
      </Typography>

      <Card style={{ marginTop: theme.space.xl }}>
        <Typography variant="label" style={{ letterSpacing: 1, marginBottom: theme.space.sm }}>
          Discover & improve
        </Typography>
        <HubNavRow
          title="Browse job listings"
          subtitle="Aggregated roles — same discovery flow as the web dashboard Jobs page."
          icon={Search}
          accessibilityHint="Opens job discovery on the Home tab."
          onPress={navJobsBoard}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Resume library"
          subtitle="Uploads, parsing status, and which file is active for matching."
          icon={FileText}
          accessibilityHint="Opens your resume library."
          onPress={() => navigation.navigate('ResumeOverview')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Submit a careers page"
          subtitle="Suggest a company job board for admin review and ingestion."
          icon={Globe}
          accessibilityHint="Opens the careers page submission form."
          onPress={() => navigation.navigate('SubmitCareersPage')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Matched jobs"
          subtitle="Ranked roles based on your candidate profile and skills."
          icon={Sparkles}
          accessibilityHint="Opens matched jobs."
          onPress={() => navigation.navigate('MatchedJobs')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Calendar"
          subtitle="Coming soon · Google Calendar sync when OAuth ships."
          icon={Calendar}
          accessibilityHint="Opens calendar preview."
          onPress={() => navigation.navigate('CalendarPlaceholder')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Billing"
          subtitle="Current plan, entitlements, and upgrades via the web billing page."
          icon={CreditCard}
          accessibilityHint="Opens your plan and subscription details."
          onPress={() => navigation.navigate('BillingPlaceholder')}
        />
      </Card>

      <Card style={{ marginTop: theme.space.lg }}>
        <Typography variant="label" style={{ letterSpacing: 1, marginBottom: theme.space.sm }}>
          Account
        </Typography>
        <HubNavRow
          title="Settings"
          subtitle="Profile, appearance, theme, session, and App Store–style account controls."
          icon={Settings}
          accessibilityHint="Opens account and appearance settings."
          onPress={() => navigation.navigate('Settings')}
        />
      </Card>
    </Screen>
  );
}
