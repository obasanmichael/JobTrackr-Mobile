import type { ReminderDto } from '../types/reminder.dto';
import { getApi } from './api';

export type PatchReminderPayload = {
  applicationId?: string;
  title?: string;
  description?: string | null;
  dueDate?: string;
  isCompleted?: boolean;
};

export async function fetchReminders(): Promise<ReminderDto[]> {
  const api = await getApi();
  const { data } = await api.get<ReminderDto[]>('/reminders');
  return data;
}

export async function patchReminder(id: string, payload: PatchReminderPayload): Promise<ReminderDto> {
  const api = await getApi();
  const { data } = await api.patch<ReminderDto>(`/reminders/${id}`, payload);
  return data;
}
