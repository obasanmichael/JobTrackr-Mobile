import { UserRound } from 'lucide-react-native';
import { useState, type ReactElement } from 'react';
import { View } from 'react-native';
import { ProfilePhotoActions } from './profile-photo-actions';
import { Button, Card, TextField, Typography } from '../ui';
import { updateUserProfileRequest } from '../../services/users.service';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

export function ProfileSettingsCard(): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const savedName = user?.name ?? '';
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);
  const name = nameDraft ?? savedName;

  const nameDirty = user ? name.trim() !== savedName : false;

  async function handleSaveName(): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;

    setSavingName(true);
    try {
      await updateUserProfileRequest({ name: trimmed });
      await refreshUser();
      setNameDraft(null);
      showSuccessFeedback('Profile updated');
    } catch (err) {
      showErrorFeedback(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setSavingName(false);
    }
  }

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        <UserRound size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography variant="label">Profile</Typography>
      </View>
      <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
        Update your display name and profile photo.
      </Typography>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.lg }}>
        <ProfilePhotoActions />
        <Typography variant="bodySmall" muted style={{ flex: 1 }}>
          Tap your photo to view, change, or remove it.
        </Typography>
      </View>

      <TextField
        label="Display name"
        value={name}
        onChangeText={setNameDraft}
        placeholder="Your name"
        maxLength={120}
      />

      <TextField label="Email" value={user?.email ?? ''} editable={false} />
      <Typography variant="caption" muted>
        Email changes are not available yet.
      </Typography>

      <Button
        label={savingName ? 'Saving…' : 'Save changes'}
        block
        disabled={!nameDirty || savingName || !name.trim()}
        onPress={() => void handleSaveName()}
      />
    </Card>
  );
}
