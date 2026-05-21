import { useEffect, type ReactElement } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { useFeedbackStore } from '../../lib/feedback';
import { useAppTheme } from '../../theme';

const AUTO_DISMISS_MS = 3200;

export function FeedbackToastHost(): ReactElement | null {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const message = useFeedbackStore((s) => s.message);
  const type = useFeedbackStore((s) => s.type);
  const clear = useFeedbackStore((s) => s.clear);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clear, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [message, clear]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: theme.space.lg,
        right: theme.space.lg,
        bottom: insets.bottom + theme.space.lg,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: isSuccess ? 'rgba(22, 163, 74, 0.35)' : 'rgba(220, 38, 38, 0.35)',
          backgroundColor: theme.mode === 'dark' ? theme.colors.surfaceElevated : theme.colors.surface,
          paddingVertical: theme.space.md,
          paddingHorizontal: theme.space.lg,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <Typography
          variant="bodySmall"
          style={{
            color: isSuccess ? theme.colors.success : theme.colors.danger,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </View>
    </View>
  );
}
