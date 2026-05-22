import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react-native';
import { useCallback, type ReactElement } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import { Button, Card, LoadingState, Screen, Typography } from '../components/ui';
import {
  listNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
  type NotificationItem,
} from '../services/notifications.service';
import { parseAxiosApiError } from '../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../lib/feedback';
import { useAppTheme } from '../theme';

function formatWhen(value: string): string {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
}

function NotificationRow({
  item,
  onMarkRead,
  disabled,
}: {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
  disabled: boolean;
}): ReactElement {
  const { theme } = useAppTheme();
  const unread = !item.readAt;

  return (
    <Card
      style={{
        gap: theme.space.sm,
        borderColor: unread ? theme.colors.accent : theme.colors.borderMuted,
        backgroundColor: unread ? theme.colors.accentMuted : theme.colors.surface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        {unread ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.colors.accent,
            }}
          />
        ) : null}
        <Typography variant="bodySmall" style={{ fontWeight: '600', flex: 1 }}>
          {item.title}
        </Typography>
      </View>
      <Typography variant="bodySmall" muted>
        {item.message}
      </Typography>
      <Typography variant="caption" muted>
        {formatWhen(item.createdAt)}
      </Typography>
      {unread ? (
        <Button
          label="Mark read"
          variant="secondary"
          disabled={disabled}
          onPress={() => onMarkRead(item.id)}
        />
      ) : null}
    </Card>
  );
}

export function NotificationsScreen(): ReactElement {
  const { theme } = useAppTheme();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => listNotificationsRequest({ limit: 50 }),
    refetchInterval: 60_000,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationReadRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not update notification.');
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsReadRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showSuccessFeedback('All notifications marked as read');
    },
    onError: (error) => {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not mark all as read.');
    },
  });

  const onRefresh = useCallback(() => {
    void listQuery.refetch();
  }, [listQuery]);

  const items = listQuery.data?.items ?? [];
  const unreadCount = listQuery.data?.unreadCount ?? 0;

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      refreshControl={
        <RefreshControl refreshing={listQuery.isFetching} onRefresh={onRefresh} />
      }
    >
      <Typography variant="bodySmall" muted>
        Reminders, interviews, and other alerts from JobTrackr.
      </Typography>

      <View style={{ marginTop: theme.space.lg }}>
        <Button
          label={markAllMutation.isPending ? 'Marking…' : 'Mark all read'}
          variant="secondary"
          block
          disabled={unreadCount === 0 || markAllMutation.isPending}
          onPress={() => void markAllMutation.mutate()}
        />
      </View>

      {listQuery.isLoading ? (
        <View style={{ marginTop: theme.space.xl }}>
          <LoadingState message="Loading notifications…" />
        </View>
      ) : listQuery.error ? (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
          <Typography variant="bodySmall" style={{ color: theme.colors.danger }}>
            {parseAxiosApiError(listQuery.error)?.message ?? 'Could not load notifications.'}
          </Typography>
          <Button label="Retry" variant="secondary" block onPress={() => void listQuery.refetch()} />
        </View>
      ) : items.length === 0 ? (
        <Card style={{ marginTop: theme.space.xl, alignItems: 'center', gap: theme.space.md }}>
          <Bell size={28} color={theme.colors.textMuted} strokeWidth={2} />
          <Typography variant="bodySmall" muted style={{ textAlign: 'center' }}>
            No notifications yet. When reminders or interviews are due, they will show up here.
          </Typography>
        </Card>
      ) : (
        <View style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
          {items.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              disabled={markReadMutation.isPending}
              onMarkRead={(id) => markReadMutation.mutate(id)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
