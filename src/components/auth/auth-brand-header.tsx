import { Briefcase } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Typography } from '../ui';
import { useAppTheme } from '../../theme';

/**
 * App mark + wordmark aligned with web auth branding (briefcase on accent tile).
 */
export function AuthBrandHeader(): ReactElement {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space.md,
        marginBottom: theme.space.xl,
      }}
      accessibilityRole="header"
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel="JobTrackr"
      >
        <Briefcase color={theme.colors.onAccent} size={26} strokeWidth={2} />
      </View>
      <Typography variant="hero" style={{ fontSize: 28, letterSpacing: -0.5 }}>
        JobTrackr
      </Typography>
    </View>
  );
}
