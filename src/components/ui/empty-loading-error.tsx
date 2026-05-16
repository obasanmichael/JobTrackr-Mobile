import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from './Button';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

type EmptyProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, onActionPress }: EmptyProps): ReactElement {
  const { theme } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.space.xxl, paddingHorizontal: theme.space.lg }}>
      {Icon ? (
        <Icon size={40} color={theme.colors.textMuted} strokeWidth={1.75} style={{ marginBottom: theme.space.md }} />
      ) : null}
      <Typography variant="title" style={{ textAlign: 'center', marginBottom: theme.space.sm }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="bodySmall" muted style={{ textAlign: 'center', marginBottom: theme.space.lg }}>
          {description}
        </Typography>
      ) : null}
      {actionLabel && onActionPress ? (
        <Button label={actionLabel} variant="secondary" onPress={onActionPress} />
      ) : null}
    </View>
  );
}

type LoadingProps = { message?: string };

export function LoadingState({ message }: LoadingProps): ReactElement {
  const { theme } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: theme.space.xxl }}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        {message ?? 'Loading…'}
      </Typography>
    </View>
  );
}

type ErrorProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  retryLabel = 'Try again',
  onRetry,
}: ErrorProps): ReactElement {
  const { theme } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.space.xl, paddingHorizontal: theme.space.lg }}>
      <Typography variant="title" style={{ marginBottom: theme.space.sm, textAlign: 'center', color: theme.colors.danger }}>
        {title}
      </Typography>
      <Typography variant="bodySmall" muted style={{ textAlign: 'center', marginBottom: theme.space.lg }}>
        {message}
      </Typography>
      {onRetry ? <Button label={retryLabel} variant="outline" onPress={onRetry} /> : null}
    </View>
  );
}
