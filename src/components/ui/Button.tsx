import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  block?: boolean;
  onPress: () => void;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  style,
  block,
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
    ghost: { backgroundColor: 'transparent' },
  };

  const textColor =
    variant === 'primary' ? theme.colors.onAccent : variant === 'secondary' ? theme.colors.textPrimary : theme.colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        base,
        surfaces[variant],
        pressed && variant !== 'ghost' && { transform: [{ scale: 0.985 }] },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        {loading && <ActivityIndicator color={variant === 'primary' ? theme.colors.onAccent : theme.colors.accent} />}
        <Typography variant="bodySmall" style={{ fontWeight: '600', color: textColor }}>
          {label}
        </Typography>
      </View>
    </Pressable>
  );
}
