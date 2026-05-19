import type { ComponentProps, PropsWithChildren, ReactElement } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
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
  /** Only applies when scroll is enabled. */
  refreshControl?: ReactElement<ComponentProps<typeof RefreshControl>>;
  /**
   * When scroll is enabled: vertically center children if they’re shorter than the viewport
   * (comfortable auth / empty states); scroll still works when the keyboard opens or content grows.
   */
  verticallyCenterScrollContent?: boolean;
  /** Wraps the safe area in `KeyboardAvoidingView` (pairs well with scroll + forms). */
  keyboardAvoiding?: boolean;
  /** Offset when a translucent header overlaps the keyboard inset (native-stack pushes). */
  keyboardVerticalOffset?: number;
  /** Vertical scroll only — dismisses the keyboard while scrolling (defaults by platform). */
  keyboardDismissMode?: ScrollViewProps['keyboardDismissMode'];
}>;

export function Screen({
  children,
  scroll,
  contentPadding = 'xl',
  edges = ['top', 'left', 'right'],
  style,
  constrainContentColumn = true,
  refreshControl,
  verticallyCenterScrollContent,
  keyboardAvoiding,
  keyboardVerticalOffset = 0,
  keyboardDismissMode,
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

  const dismissMode: ScrollViewProps['keyboardDismissMode'] =
    keyboardDismissMode ?? (Platform.OS === 'ios' ? 'interactive' : 'on-drag');

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={dismissMode}
      refreshControl={refreshControl}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: verticallyCenterScrollContent ? 'center' : 'flex-start',
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

  const shell = (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
    >
      {body}
    </SafeAreaView>
  );

  if (!keyboardAvoiding) return shell;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {shell}
    </KeyboardAvoidingView>
  );
}
