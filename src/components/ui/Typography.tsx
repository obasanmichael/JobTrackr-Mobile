import type { PropsWithChildren } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { TEXT_MAX_FONT_SCALE_MULTIPLIER } from '../../theme/accessibility';
import { useAppTheme } from '../../theme';
import type { TypographyVariant } from '../../theme/types';

type Props = PropsWithChildren<
  Omit<RNTextProps, 'style'> & {
    variant?: TypographyVariant;
    muted?: boolean;
    style?: RNTextProps['style'];
    color?: string;
    /** Cap extreme Dynamic Type scaling (defaults to theme accessibility cap). */
    maxFontSizeMultiplier?: number;
  }
>;

export function Typography({
  variant = 'body',
  muted,
  children,
  style,
  color,
  maxFontSizeMultiplier = TEXT_MAX_FONT_SCALE_MULTIPLIER,
  ...rest
}: Props) {
  const { theme } = useAppTheme();
  const base = theme.typography.variants[variant];
  const textColor = muted ? theme.colors.textMuted : color ?? base.color;

  return (
    <RNText {...rest} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[base, { color: textColor }, style]}>
      {children}
    </RNText>
  );
}
