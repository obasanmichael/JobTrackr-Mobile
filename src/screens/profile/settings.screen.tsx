import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { LogOut, Palette, Shield, UserRound } from 'lucide-react-native';
import { AppearancePreferenceControl } from '../../components/settings/appearance-preference-control';
import { Button, Card, HubNavRow, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import type { MoreStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Settings'>;

/** Profile, appearance, and session — parity with Desktop → Settings (not Discover shortcuts). */
export function SettingsScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="bodySmall" muted>
        Manage how JobTrackr looks and how you stay signed in on this device.
      </Typography>

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
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
            Preview mode isn’t syncing account fields. Sign in to mirror your production profile.
          </Typography>
        ) : (
          <Typography variant="bodySmall" muted>
            Profile details populate after authentication.
          </Typography>
        )}
      </Card>

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
            Developers use the gallery below to QA components — it stays out of release-quality navigation for end users.
          </Typography>
          <Button label="Open developer gallery" variant="secondary" block onPress={() => navigation.navigate('DesignReference')} />
        </View>
      ) : null}
    </Screen>
  );
}
