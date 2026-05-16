import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useAppTheme } from '../../theme';

export function Card({ children, style, ...rest }: PropsWithChildren<ViewProps>) {
  const { theme } = useAppTheme();
  const s = theme.shadows.card;

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.borderMuted,
          padding: theme.space.lg,
          shadowColor: s.shadowColor,
          shadowOffset: s.shadowOffset,
          shadowOpacity: s.shadowOpacity,
          shadowRadius: s.shadowRadius,
          elevation: s.elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
