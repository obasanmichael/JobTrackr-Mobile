import { TextInput, View, type TextInputProps } from 'react-native';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

type Props = Omit<TextInputProps, 'placeholderTextColor'> & {
  label?: string;
};

export function TextField({ label, style, ...rest }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.space.xs }}>
      {label ? <Typography variant="caption">{label}</Typography> : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        {...rest}
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
