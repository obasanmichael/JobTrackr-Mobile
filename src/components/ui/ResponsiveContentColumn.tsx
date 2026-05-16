import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import { useResponsive } from '../../layout';

type Props = PropsWithChildren<ViewProps>;

/**
 * Constrains and centers readable content on tablet / wide layouts.
 * Phones: full width inside parent padding only.
 */
export function ResponsiveContentColumn({ children, style, ...rest }: Props) {
  const { contentColumnMaxWidth } = useResponsive();

  return (
    <View
      {...rest}
      style={[
        {
          width: '100%',
          ...(contentColumnMaxWidth != null && {
            maxWidth: contentColumnMaxWidth,
            alignSelf: 'center',
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
