import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import {
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  LogOut,
  Palette,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react-native';
import { AppearancePreferenceControl } from '../../components/settings/appearance-preference-control';
import { Button, Card, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import type { BottomTabParamList, ProfileStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileOverview'>;

function SettingsNavRow(props: {
  title: string;
  caption?: string;
  icon: LucideIcon;
  onPress: () => void;
  testID?: string;
}): ReactElement {
  const { theme } = useAppTheme();
  const Icon = props.icon;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      testID={props.testID}
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
        {props.caption ? (
          <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>
            {props.caption}
          </Typography>
        ) : null}
      </View>
      <ChevronRight color={theme.colors.textMuted} size={22} strokeWidth={2} />
    </Pressable>
  );
}

export function ProfileOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navJobsBoard = (): void => {
    const tabNav = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    tabNav?.navigate('Home', { screen: 'JobSearch' });
  };
  const navResumeLibrary = (): void => navigation.navigate('ResumeOverview');

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero">Settings</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Manage your account preferences—the same headings you see on desktop.
      </Typography>

      {/* Profile — aligns with JobTrackr dashboard settings card */}
      <Card style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
          <UserRound size={18} color={theme.colors.textMuted} strokeWidth={2} />
          <Typography variant="label">Profile</Typography>
        </View>
        <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
          Your account information.
        </Typography>
        {user ? (
          <>
            <View style={{ gap: theme.space.xs }}>
              <Typography variant="caption" muted>
                Name
              </Typography>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                {user.name ?? '—'}
              </Typography>
            </View>
            <View style={{ gap: theme.space.xs, marginTop: theme.space.sm }}>
              <Typography variant="caption" muted>
                Email
              </Typography>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                {user.email ?? '—'}
              </Typography>
            </View>
          </>
        ) : UI_SCAFFOLD_BYPASS_AUTHENTICATION ? (
          <Typography variant="bodySmall" muted>
            Preview mode isn’t syncing account fields. Sign in to mirror your production profile snapshot.
          </Typography>
        ) : (
          <Typography variant="bodySmall" muted>
            Profile details populate after authentication.
          </Typography>
        )}
      </Card>

      {/* Appearance */}
      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
          <Palette size={18} color={theme.colors.textMuted} strokeWidth={2} />
          <Typography variant="label">Appearance</Typography>
        </View>
        <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
          Choose how JobTrackr looks on this phone.
        </Typography>
        <AppearancePreferenceControl />
      </Card>

      {/* Sidebar parity */}
      <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
        <Typography variant="label">Workspace shortcuts</Typography>
        <Typography variant="caption" muted>
          Companion links for sections that primarily live inside the broader web sidebar.
        </Typography>
        <View style={{ marginTop: theme.space.sm }}>
          <SettingsNavRow
            title="Browse job listings"
            caption="Same aggregated job-search flow as Desktop → Discover."
            icon={Search}
            onPress={navJobsBoard}
            testID="settings-nav-jobs"
          />
          <SettingsNavRow
            title="Resume library"
            caption="Upload, inspect parsing status, and mark the resume that anchors AI matching workflows."
            icon={FileText}
            onPress={navResumeLibrary}
            testID="settings-nav-resume"
          />
          <SettingsNavRow
            title="Matched jobs"
            caption="Preview-only placeholder mirrored from the Matches page until Phase V2B lands."
            icon={Sparkles}
            onPress={() => navigation.navigate('MatchedJobsPlaceholder')}
          />
          <SettingsNavRow
            title="Calendar"
            caption="Google Calendar pairing ships with the OAuth milestone listed on desktop."
            icon={Calendar}
            onPress={() => navigation.navigate('CalendarPlaceholder')}
          />
          <SettingsNavRow
            title="Billing"
            caption="Free during beta; paid tiers inherit the roadmap language from the Billing page."
            icon={CreditCard}
            onPress={() => navigation.navigate('BillingPlaceholder')}
          />
        </View>
      </Card>

      {/* Session */}
      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
          <LogOut size={18} color={theme.colors.textMuted} strokeWidth={2} />
          <Typography variant="label">Session</Typography>
        </View>
        <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
          Sign out of your account on this device.
        </Typography>
        <Button label="Log out" variant="danger" block onPress={() => void logout()} />
      </Card>

      {__DEV__ ? (
        <View style={{ marginTop: theme.space.xxl, gap: theme.space.sm }}>
          <Typography variant="caption" muted>
            Developers lean on this gallery to QA buttons and typography tokens—it’s intentionally hidden outside dev builds.
          </Typography>
          <Button label="Open developer gallery" variant="secondary" block onPress={() => navigation.navigate('DesignReference')} />
        </View>
      ) : null}
    </Screen>
  );
}
