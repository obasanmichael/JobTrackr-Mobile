import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { AppearancePreferenceControl } from '../../components/settings/appearance-preference-control';
import { Button, Card, Screen, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import type { ProfileStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileOverview'>;

export function ProfileOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen scroll>
      <Typography variant="hero">Profile</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Account settings and appearance.
      </Typography>

      <Card style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        <Typography variant="label">Appearance</Typography>
        <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
          Light, dark, or follow your phone’s setting.
        </Typography>
        <AppearancePreferenceControl />
      </Card>

      {user ? (
        <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="title">{user.name}</Typography>
          <Typography variant="bodySmall" muted>
            {user.email}
          </Typography>
        </Card>
      ) : UI_SCAFFOLD_BYPASS_AUTHENTICATION ? (
        <Typography variant="bodySmall" muted style={{ marginTop: theme.space.lg }}>
          You’re viewing the app with offline UI preview. Sign in normally to sync your profile.
        </Typography>
      ) : null}

      <View style={{ marginTop: theme.space.xl }}>
        <Button label="Log out" variant="outline" block onPress={() => void logout()} />
      </View>

      {__DEV__ ? (
        <View style={{ marginTop: theme.space.xxl, gap: theme.space.sm }}>
          <Typography variant="caption" muted>
            Developers use the component gallery to QA buttons and feedback states—it isn’t meant for signing out or
            day-to-day use.
          </Typography>
          <Button
            label="Open developer component gallery"
            variant="secondary"
            block
            onPress={() => navigation.navigate('DesignReference')}
          />
        </View>
      ) : null}
    </Screen>
  );
}
