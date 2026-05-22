import { Palette } from 'lucide-react-native';
import { useState, type ReactElement } from 'react';
import { View } from 'react-native';
import { AppearancePreferenceControl } from './appearance-preference-control';
import { Button, Card, Typography } from '../ui';
import { updateUserProfileRequest } from '../../services/users.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme, type ThemePreference } from '../../theme';

export function AppearanceSettingsCard(): ReactElement {
  const { theme, preference, setPreference } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [saving, setSaving] = useState(false);

  const savedPreference = (user?.themePreference ?? 'system') as ThemePreference;
  const dirty = preference !== savedPreference;

  async function handleSave(): Promise<void> {
    setSaving(true);
    try {
      await updateUserProfileRequest({ themePreference: preference });
      await refreshUser();
      showSuccessFeedback('Appearance saved');
    } catch (error) {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not save appearance.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        <Palette size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography variant="label">Appearance</Typography>
      </View>
      <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
        Choose how JobTrackr looks. Saved to your account and synced across devices.
      </Typography>

      <AppearancePreferenceControl
        preference={preference}
        onPreferenceChange={setPreference}
      />

      <Button
        label={saving ? 'Saving…' : 'Save appearance'}
        block
        loading={saving}
        disabled={!dirty}
        onPress={() => void handleSave()}
      />
    </Card>
  );
}
