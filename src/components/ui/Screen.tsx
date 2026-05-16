import type { PropsWithChildren } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../../layout';
import type { Theme } from '../../theme/types';
import { useAppTheme } from '../../theme';
import { ResponsiveContentColumn } from './ResponsiveContentColumn';

type Props = PropsWithChildren<{
  scroll?: boolean;
  contentPadding?: keyof Theme['space'];
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  style?: ViewStyle;
  /** Set false for deliberate full-width layouts (charts, banners). Defaults true — still only clamps on tablets. */
  constrainContentColumn?: boolean;
}>;

export function Screen({
  children,
  scroll,
  contentPadding = 'xl',
  edges = ['top', 'left', 'right'],
  style,
  constrainContentColumn = true,
}: Props) {
  const { theme } = useAppTheme();
  const responsive = useResponsive();
  const basePad = theme.space[contentPadding];

  /** Tablet: more horizontal inset; compact phones: keep usable width */
  let horizontalPad = basePad;
  let verticalPad = basePad;
  let bottomExtra = theme.space.lg;

  if (responsive.isTablet) {
    horizontalPad = basePad + theme.space.md;
    horizontalPad = Math.min(horizontalPad, responsive.isExpandedTablet ? 72 : 56);
  }

  if (responsive.breakpoint === 'compact') {
    horizontalPad = Math.max(theme.space.md, horizontalPad - theme.space.sm);
  }

  /** Phone landscape: use horizontal breathing room without crowding vertically */
  if (responsive.phoneLandscapeComfort) {
    horizontalPad = Math.round(horizontalPad * 1.15);
    verticalPad = Math.max(theme.space.sm, Math.round(basePad * 0.88));
    bottomExtra = Math.max(theme.space.md, Math.round(bottomExtra * 0.9));
  }

  const constrained = constrainContentColumn ? (
    <ResponsiveContentColumn>{children}</ResponsiveContentColumn>
  ) : (
    children
  );

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: horizontalPad,
        paddingTop: verticalPad,
        paddingBottom: verticalPad + bottomExtra,
      }}
    >
      {constrained}
    </ScrollView>
  ) : (
    <View
      style={{
        flex: 1,
        paddingHorizontal: horizontalPad,
        paddingTop: verticalPad,
        paddingBottom: verticalPad,
      }}
    >
      {constrained}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
    >
      {body}
    </SafeAreaView>
  );
}
