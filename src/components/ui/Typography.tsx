import type { PropsWithChildren } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useAppTheme } from '../../theme';
import type { TypographyVariant } from '../../theme/types';

type Props = PropsWithChildren<
  Omit<RNTextProps, 'style'> & {
    variant?: TypographyVariant;
    muted?: boolean;
    style?: RNTextProps['style'];
    color?: string;
  }
>;

export function Typography({ variant = 'body', muted, children, style, color, ...rest }: Props) {
  const { theme } = useAppTheme();
  const base = theme.typography.variants[variant];
  const textColor = muted ? theme.colors.textMuted : color ?? base.color;

  return (
    <RNText {...rest} style={[base, { color: textColor }, style]}>
      {children}
    </RNText>
  );
}
