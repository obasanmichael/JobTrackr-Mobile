import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { hapticLightImpact } from '../../lib/haptics';
import { useAppTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

type Props = {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  block?: boolean;
  /** Light impact feedback when the button is pressed (forms / confirmations). */
  hapticOnPress?: boolean;
  onPress: () => void;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  style,
  block,
  hapticOnPress,
  onPress,
}: Props) {
  const { theme } = useAppTheme();

  const base: ViewStyle = {
    minHeight: 48,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.5 : 1,
    ...(block ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }),
  };

  const surfaces: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: theme.colors.accent },
    secondary: {
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.accent,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderWidth: 0,
    },
    ghost: { backgroundColor: 'transparent' },
  };

  const textColor =
    variant === 'primary'
      ? theme.colors.onAccent
      : variant === 'secondary'
        ? theme.colors.textPrimary
        : variant === 'danger'
          ? '#FFFFFF'
          : variant === 'outline'
            ? theme.colors.accent
            : theme.colors.accent;

  const spinnerColor =
    variant === 'primary' || variant === 'danger' ? '#FFFFFF' : theme.colors.accent;

  const triggerPress = (): void => {
    if (hapticOnPress) void hapticLightImpact();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      disabled={disabled || loading}
      onPress={triggerPress}
      style={({ pressed }) => [
        base,
        surfaces[variant],
        pressed && variant !== 'ghost' && variant !== 'outline' && { transform: [{ scale: 0.985 }] },
        pressed && variant === 'outline' && { opacity: 0.92 },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        {loading && <ActivityIndicator color={spinnerColor} />}
        <Typography variant="bodySmall" style={{ fontWeight: '600', color: textColor }}>
          {label}
        </Typography>
      </View>
    </Pressable>
  );
}
