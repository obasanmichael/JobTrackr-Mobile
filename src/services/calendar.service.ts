import type {
  CalendarConnectApi,
  CalendarStatusApi,
  PatchCalendarSettingsInput,
  SyncInterviewsApi,
  SyncInterviewsInput,
} from '../types/calendar.dto';
import { getApi } from './api';

export async function fetchCalendarStatusRequest(): Promise<CalendarStatusApi> {
  const api = await getApi();
  const { data } = await api.get<CalendarStatusApi>('/calendar/status');
  return data;
}

export async function fetchCalendarConnectUrlRequest(): Promise<CalendarConnectApi> {
  const api = await getApi();
  const { data } = await api.get<CalendarConnectApi>('/calendar/google/connect');
  return data;
}

export async function disconnectCalendarRequest(): Promise<CalendarStatusApi> {
  const api = await getApi();
  const { data } = await api.post<CalendarStatusApi>('/calendar/disconnect');
  return data;
}

export async function patchCalendarSettingsRequest(
  input: PatchCalendarSettingsInput,
): Promise<CalendarStatusApi> {
  const api = await getApi();
  const { data } = await api.patch<CalendarStatusApi>('/calendar/settings', input);
  return data;
}

export async function syncCalendarInterviewsRequest(
  input: SyncInterviewsInput = {},
): Promise<SyncInterviewsApi> {
  const api = await getApi();
  const { data } = await api.post<SyncInterviewsApi>('/calendar/sync/interviews', input);
  return data;
}
