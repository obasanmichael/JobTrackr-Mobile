import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Calendar, ChevronRight, CreditCard, FileText, Search, Settings, Sparkles } from 'lucide-react-native';
import { Card, Screen, Typography } from '../../components/ui';
import type { BottomTabParamList, MoreStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHub'>;

function HubNavRow(props: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const Icon = props.icon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={props.subtitle}
      onPress={props.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space.md,
        paddingVertical: theme.space.md,
      }}
    >
      <Icon size={18} color={theme.colors.textMuted} strokeWidth={2} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
          {props.title}
        </Typography>
        {props.subtitle ? (
          <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>
            {props.subtitle}
          </Typography>
        ) : null}
      </View>
      <ChevronRight color={theme.colors.textMuted} size={22} strokeWidth={2} />
    </Pressable>
  );
}

/** Discover / Improve parity + account settings — surfaced from More instead of burying Discover under Settings. */
export function MoreHubScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();

  const navJobsBoard = (): void => {
    const tabNav = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    tabNav?.navigate('Home', { screen: 'JobSearch' });
  };

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="title">Discover & workspaces</Typography>
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
          onPress={navJobsBoard}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Resume library"
          subtitle="Uploads, parsing status, and which file is active for matching."
          icon={FileText}
          onPress={() => navigation.navigate('ResumeOverview')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Matched jobs"
          subtitle="Coming soon · preview placeholder aligned with Desktop → Matches."
          icon={Sparkles}
          onPress={() => navigation.navigate('MatchedJobsPlaceholder')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Calendar"
          subtitle="Coming soon · Google Calendar sync when OAuth ships."
          icon={Calendar}
          onPress={() => navigation.navigate('CalendarPlaceholder')}
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <HubNavRow
          title="Billing"
          subtitle="Coming soon · plan and entitlement surface from the Billing page roadmap."
          icon={CreditCard}
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
          onPress={() => navigation.navigate('Settings')}
        />
      </Card>
    </Screen>
  );
}
