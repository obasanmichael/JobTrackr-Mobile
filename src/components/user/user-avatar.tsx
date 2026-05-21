import type { ReactElement } from 'react';
import { Image, View } from 'react-native';
import { Typography } from '../ui';
import { useAppTheme } from '../../theme';

type UserAvatarProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
};

function initialsFromName(name?: string | null): string {
  if (!name?.trim()) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  name,
  avatarUrl,
  size = 40,
}: UserAvatarProps): ReactElement {
  const { theme } = useAppTheme();
  const initials = initialsFromName(name);

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.surfaceElevated,
        }}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="caption"
        style={{
          color: theme.colors.onAccent,
          fontWeight: '700',
          fontSize: Math.max(10, Math.round(size * 0.32)),
        }}
      >
        {initials}
      </Typography>
    </View>
  );
}
