import NetInfo from '@react-native-community/netinfo';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './ui/Typography';
import { useAppTheme } from '../theme';

/** Thin banner when the device loses network, aligns with Phase 3 “offline awareness” expectations. */
export function ConnectivityBanner(): ReactElement | null {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false);
    });
    return unsub;
  }, []);

  if (!offline) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100,
        backgroundColor: theme.colors.warning,
        paddingTop: insets.top,
        paddingBottom: theme.space.sm,
        paddingHorizontal: theme.space.md,
      }}
      accessibilityRole="alert"
    >
      <Typography variant="caption" style={{ color: '#0f172a', fontWeight: '700', textAlign: 'center' }}>
        Offline, reconnect to sync JobTrackr
      </Typography>
    </View>
  );
}
