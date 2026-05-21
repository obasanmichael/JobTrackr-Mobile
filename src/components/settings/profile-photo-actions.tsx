import * as ImagePicker from 'expo-image-picker';
import { useState, type ReactElement } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  View,
  Image,
} from 'react-native';
import { UserAvatar } from '../user/user-avatar';
import { Typography } from '../ui';
import {
  deleteUserAvatarRequest,
  uploadUserAvatarFile,
} from '../../services/users.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type ProfilePhotoActionsProps = {
  size?: number;
};

export function ProfilePhotoActions({
  size = 80,
}: ProfilePhotoActionsProps): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [busy, setBusy] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const hasPhoto = Boolean(user?.avatarUrl);

  async function handlePickAvatar(): Promise<void> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showErrorFeedback('Photo library access is required to choose a profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setBusy(true);
    try {
      await uploadUserAvatarFile({
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      await refreshUser();
      showSuccessFeedback('Profile photo updated');
    } catch (err) {
      showErrorFeedback(err instanceof Error ? err.message : 'Could not upload photo.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveAvatar(): Promise<void> {
    setBusy(true);
    try {
      await deleteUserAvatarRequest();
      await refreshUser();
      showSuccessFeedback('Profile photo removed');
    } catch (err) {
      const parsed = parseAxiosApiError(err);
      showErrorFeedback(parsed?.message ?? 'Could not remove photo.');
    } finally {
      setBusy(false);
    }
  }

  function confirmRemove(): void {
    Alert.alert(
      'Remove profile photo?',
      'Your photo will be deleted and initials will show instead.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove photo',
          style: 'destructive',
          onPress: () => void handleRemoveAvatar(),
        },
      ],
    );
  }

  function openPhotoOptions(): void {
    const options: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }> = [];

    if (hasPhoto) {
      options.push({
        text: 'View photo',
        onPress: () => setViewOpen(true),
      });
    }

    options.push({
      text: hasPhoto ? 'Change photo' : 'Upload photo',
      onPress: () => void handlePickAvatar(),
    });

    if (hasPhoto) {
      options.push({
        text: 'Remove photo',
        style: 'destructive',
        onPress: confirmRemove,
      });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Profile photo', 'Choose an action', options);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile photo options"
        accessibilityHint="Opens options to view, change, or remove your profile photo"
        disabled={busy}
        onPress={openPhotoOptions}
        style={{ opacity: busy ? 0.7 : 1 }}
      >
        <View>
          <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={size} />
          {busy ? (
            <View
              style={{
                position: 'absolute',
                inset: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: size / 2,
                backgroundColor: 'rgba(0,0,0,0.35)',
              }}
            >
              <ActivityIndicator color={theme.colors.onAccent} />
            </View>
          ) : null}
        </View>
      </Pressable>

      <Modal
        visible={viewOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setViewOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.space.xl,
          }}
          onPress={() => setViewOpen(false)}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 320,
              gap: theme.space.md,
            }}
          >
            <Typography variant="subtitle" style={{ textAlign: 'center' }}>
              {user?.name ?? 'Profile photo'}
            </Typography>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                accessibilityLabel={
                  user.name ? `${user.name}'s profile photo` : 'Profile photo'
                }
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: theme.radii.xl,
                  backgroundColor: theme.colors.surfaceElevated,
                }}
              />
            ) : null}
            <Typography variant="caption" muted style={{ textAlign: 'center' }}>
              Tap outside to close
            </Typography>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
