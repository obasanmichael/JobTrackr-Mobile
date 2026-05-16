import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ReactElement } from 'react';
import { Bell, Briefcase, Home as HomeIcon, Plus, UserRound } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FLOATING_TAB_BAR_BOTTOM_MARGIN,
  FLOATING_TAB_BAR_INNER_HEIGHT,
} from '../constants/floating-tab-bar-metrics';
import { useResponsive } from '../../layout';
import { useAppTheme } from '../../theme';

const TAB_ICONS: Record<string, typeof HomeIcon> = {
  Home: HomeIcon,
  Applications: Briefcase,
  QuickAdd: Plus,
  Reminders: Bell,
  Profile: UserRound,
};

export function FloatingBottomTabBar(props: BottomTabBarProps): ReactElement {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const responsive = useResponsive();

  const horizontalPad = responsive.isTablet
    ? Math.max((responsive.width - Math.min(responsive.longestSide * 0.55, 420)) / 2, theme.space.xl)
    : theme.space.md + theme.space.sm;

  const pillOuterWidthCap = responsive.isTablet ? 420 : responsive.width - horizontalPad * 2;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          paddingHorizontal: horizontalPad,
          width: '100%',
          alignItems: 'center',
          marginBottom: FLOATING_TAB_BAR_BOTTOM_MARGIN + insets.bottom,
        }}
      >
        <View
          style={{
            width: Math.min(responsive.width - horizontalPad * 2, pillOuterWidthCap),
            flexDirection: 'row',
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.radii.pill,
            height: FLOATING_TAB_BAR_INNER_HEIGHT,
            paddingHorizontal: theme.space.sm,
            borderWidth: 1,
            borderColor: theme.colors.borderMuted,
            alignItems: 'center',
            justifyContent: 'space-between',
            ...theme.shadows.tabBar,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : typeof options.title === 'string'
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;
            const Icon = TAB_ICONS[route.name] ?? HomeIcon;
            const isCenterFab = route.name === 'QuickAdd';

            const onPress = (): void => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params as never);
              }
            };

            const color = isFocused ? theme.colors.accent : theme.colors.textMuted;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={typeof label === 'string' ? label : route.name}
                key={route.key}
                hitSlop={8}
                onPress={onPress}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  maxWidth: 72,
                }}
              >
                <Icon
                  size={isCenterFab ? (isFocused ? 27 : 25) : isFocused ? 24 : 22}
                  color={color}
                  strokeWidth={isFocused ? 2.35 : 2}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
