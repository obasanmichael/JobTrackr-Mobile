import { getApi } from './api';

export type NotificationChannels = {
  email: boolean;
  push: boolean;
  inApp: boolean;
};

export type MatchCategoryPreference = {
  enabled: boolean;
  minMatchScore: number;
  channels: NotificationChannels;
};

export type TimedCategoryPreference = {
  enabled: boolean;
  channels: NotificationChannels;
  leadMinutes: number[];
};

export type NotificationCategories = {
  matches: MatchCategoryPreference;
  reminders: TimedCategoryPreference;
  interviews: TimedCategoryPreference;
};

export type NotificationPreference = {
  categories: NotificationCategories;
  updatedAt?: string;
};

export async function getNotificationPreferencesRequest(): Promise<NotificationPreference> {
  const api = await getApi();
  const { data } = await api.get<NotificationPreference>('/notifications/preferences');
  return data;
}

export async function updateNotificationPreferencesRequest(
  payload: { categories: NotificationCategories },
): Promise<NotificationPreference> {
  const api = await getApi();
  const { data } = await api.patch<NotificationPreference>(
    '/notifications/preferences',
    payload,
  );
  return data;
}
