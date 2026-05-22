import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { LogOut, Shield } from 'lucide-react-native';
import { AppearanceSettingsCard } from '../../components/settings/appearance-settings-card';
import { NotificationsSettingsCard } from '../../components/settings/notifications-settings-card';
import { ProfileSettingsCard } from '../../components/settings/profile-settings-card';
import { SecuritySettingsCard } from '../../components/settings/security-settings-card';
import { TimezoneSettingsCard } from '../../components/settings/timezone-settings-card';
import { Button, Card, HubNavRow, Screen, Typography } from '../../components/ui';
import type { MoreStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Settings'>;

/** Profile, appearance, and session, parity with Desktop → Settings (not Discover shortcuts). */
export function SettingsScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="bodySmall" muted>
        Manage how JobTrackr looks and how you stay signed in on this device.
      </Typography>

      <View style={{ marginTop: theme.space.lg }}>
        <ProfileSettingsCard />
      </View>

      <View style={{ marginTop: theme.space.lg }}>
        <SecuritySettingsCard />
      </View>

      <View style={{ marginTop: theme.space.lg }}>
        <NotificationsSettingsCard />
      </View>

      <View style={{ marginTop: theme.space.lg }}>
        <TimezoneSettingsCard />
      </View>

      <View style={{ marginTop: theme.space.lg }}>
        <AppearanceSettingsCard />
      </View>

      <Card style={{ marginTop: theme.space.lg }}>
        <Typography variant="label" style={{ letterSpacing: 1, marginBottom: theme.space.sm }}>
          Privacy & legal
        </Typography>
        <HubNavRow
          title="Privacy, terms & support"
          subtitle="Privacy policy, terms of service, contact support, and account deletion."
          icon={Shield}
          accessibilityHint="Opens policies, support links, and account deletion information."
          onPress={() => navigation.navigate('LegalInformation')}
        />
      </Card>

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
            Developers use the gallery below to QA components, it stays out of release-quality navigation for end users.
          </Typography>
          <Button label="Open developer gallery" variant="secondary" block onPress={() => navigation.navigate('DesignReference')} />
        </View>
      ) : null}
    </Screen>
  );
}
