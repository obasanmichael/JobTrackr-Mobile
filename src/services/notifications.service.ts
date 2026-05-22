import { getApi } from './api';

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationListResult = {
  items: NotificationItem[];
  unreadCount: number;
};

export async function listNotificationsRequest(params?: {
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationListResult> {
  const api = await getApi();
  const { data } = await api.get<NotificationListResult>('/notifications', {
    params,
  });
  return data;
}

export async function getUnreadNotificationCountRequest(): Promise<number> {
  const api = await getApi();
  const { data } = await api.get<{ unreadCount: number }>('/notifications/unread-count');
  return data.unreadCount;
}

export async function markNotificationReadRequest(
  notificationId: string,
): Promise<NotificationItem> {
  const api = await getApi();
  const { data } = await api.patch<NotificationItem>(
    `/notifications/${notificationId}/read`,
  );
  return data;
}

export async function markAllNotificationsReadRequest(): Promise<number> {
  const api = await getApi();
  const { data } = await api.post<{ updatedCount: number }>('/notifications/read-all');
  return data.updatedCount;
}
