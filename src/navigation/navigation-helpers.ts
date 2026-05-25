import {
  CommonActions,
  type NavigationProp,
  type ParamListBase,
  type PartialRoute,
  type PartialState,
  type NavigationState,
} from '@react-navigation/native';

import type { BottomTabParamList, MoreStackParamList } from './types';
import { TAB_ROOT_TITLES } from './stack-screen-options';

type TabName = keyof BottomTabParamList;

/** Minimal navigation surface used by tab bar helpers (avoids requiring `setOptions`). */
type TabNavigation = Pick<NavigationProp<ParamListBase>, 'navigate' | 'dispatch'>;

type RouteWithOptionalState = {
  state?: NavigationState | PartialState<NavigationState>;
};

/** Initial screen for each bottom tab stack. */
export const TAB_ROOT_SCREEN: Record<TabName, string> = {
  Home: 'HomeOverview',
  Applications: 'ApplicationList',
  QuickAdd: 'QuickAddApplication',
  Reminders: 'RemindersOverview',
  More: 'MoreHub',
};

export function getTabNestedIndex(route: RouteWithOptionalState): number {
  if (!route.state || typeof route.state.index !== 'number') {
    return 0;
  }
  return route.state.index;
}

export function buildMoreStackState(
  screen: keyof MoreStackParamList,
  params?: MoreStackParamList[keyof MoreStackParamList],
): PartialRoute<NavigationState['routes'][number]>[] {
  if (screen === 'MoreHub') {
    return [{ name: 'MoreHub' }];
  }

  return [
    { name: 'MoreHub' },
    { name: screen, params },
  ];
}

/**
 * Open a More-stack screen with MoreHub underneath so back navigation always works,
 * including cross-tab jumps from Home.
 */
export function openMoreScreen(
  navigation: TabNavigation,
  screen: keyof MoreStackParamList,
  params?: MoreStackParamList[keyof MoreStackParamList],
): void {
  if (screen === 'MoreHub') {
    navigation.navigate('More', { screen: 'MoreHub' });
    return;
  }

  navigation.dispatch(
    CommonActions.navigate({
      name: 'More',
      params: {
        state: {
          routes: buildMoreStackState(screen, params),
          index: 1,
        },
      },
    }),
  );
}

/** Pop a tab's nested stack to its root screen (standard iOS re-tap behavior). */
export function navigateToTabRoot(
  navigation: TabNavigation,
  tabName: TabName,
): void {
  navigation.navigate(tabName, {
    screen: TAB_ROOT_SCREEN[tabName],
  });
}

export { TAB_ROOT_TITLES };
