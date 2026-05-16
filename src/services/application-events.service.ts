import type { ApplicationEventType } from '../constants/application-event-type';
import type { ApplicationEventDto } from '../types/application-event.dto';
import { getApi } from './api';

export type CreateTimelineEventPayload = {
  type: ApplicationEventType;
  title: string;
  description?: string;
};

export async function fetchApplicationTimeline(applicationId: string): Promise<ApplicationEventDto[]> {
  const api = await getApi();
  const { data } = await api.get<ApplicationEventDto[]>(`/applications/${applicationId}/events`);
  return data;
}

export async function createApplicationEventRequest(
  applicationId: string,
  payload: CreateTimelineEventPayload,
): Promise<ApplicationEventDto> {
  const api = await getApi();
  const { data } = await api.post<ApplicationEventDto>(
    `/applications/${applicationId}/events`,
    payload,
  );
  return data;
}

export async function deleteApplicationEventRequest(eventId: string): Promise<void> {
  const api = await getApi();
  await api.delete(`/application-events/${eventId}`);
}
