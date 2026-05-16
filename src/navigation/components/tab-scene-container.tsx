import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { floatingTabVerticalReserve } from '../constants/floating-tab-bar-metrics';

/**
 * Applies bottom inset so vertically scrolling tab content clears the floating bar.
 * Stacks sit inside each tab scene; avoids duplicating inset math inside every Screen.
 */
export function TabSceneContainer({ children }: PropsWithChildren): ReactElement {
  const insets = useSafeAreaInsets();
  const pb = floatingTabVerticalReserve(insets.bottom);
  return <View style={[styles.flex, { paddingBottom: pb }]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
