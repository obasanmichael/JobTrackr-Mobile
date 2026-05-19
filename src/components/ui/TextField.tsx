import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

type Props = Omit<TextInputProps, 'placeholderTextColor' | 'secureTextEntry'> & {
  label?: string;
  /** Use with passwords: eye control toggles masking (same pattern as web). */
  passwordToggle?: boolean;
  secureTextEntry?: boolean;
};

export function TextField({
  label,
  style,
  passwordToggle,
  secureTextEntry,
  accessibilityLabel: accessibilityLabelProp,
  placeholder,
  ...rest
}: Props) {
  const { theme } = useAppTheme();
  const [obscured, setObscured] = useState(true);

  const mergedA11yLabel =
    accessibilityLabelProp ??
    (label
      ? `${label}${placeholder ? `. ${placeholder}` : ''}`
      : placeholder !== undefined && placeholder !== ''
        ? String(placeholder)
        : undefined);

  if (passwordToggle) {
    return (
      <View style={{ gap: theme.space.xs }}>
        {label ? (
          <Typography variant="caption" importantForAccessibility="no">
            {label}
          </Typography>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surfaceElevated,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            minHeight: 48,
            paddingRight: theme.space.sm,
          }}
        >
          <TextInput
            placeholderTextColor={theme.colors.textMuted}
            {...rest}
            placeholder={placeholder}
            accessibilityLabel={mergedA11yLabel}
            secureTextEntry={obscured}
            style={[
              {
                flex: 1,
                ...theme.typography.variants.body,
                color: theme.colors.textPrimary,
                paddingVertical: theme.space.md,
                paddingLeft: theme.space.lg,
                paddingRight: theme.space.sm,
                minHeight: 48,
              },
              style,
            ]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={obscured ? 'Show password' : 'Hide password'}
            onPress={() => setObscured((o) => !o)}
            hitSlop={10}
            style={{ padding: theme.space.sm }}
          >
            {obscured ? (
              <Eye size={20} color={theme.colors.textMuted} strokeWidth={2} />
            ) : (
              <EyeOff size={20} color={theme.colors.textMuted} strokeWidth={2} />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.space.xs }}>
      {label ? (
        <Typography variant="caption" importantForAccessibility="no">
          {label}
        </Typography>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        {...rest}
        placeholder={placeholder}
        accessibilityLabel={mergedA11yLabel}
        style={[
          {
            ...theme.typography.variants.body,
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surfaceElevated,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            paddingVertical: theme.space.md,
            paddingHorizontal: theme.space.lg,
            minHeight: 48,
          },
          style,
        ]}
      />
    </View>
  );
}
