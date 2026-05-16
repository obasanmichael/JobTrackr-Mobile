import type { ApplicationStatus } from '../constants/application-status';
import type { ApplicationDto, ApplicationQueryParams } from '../types/application.dto';
import type { WorkMode } from '../constants/work-mode';
import { getApi } from './api';

export type CreateApplicationPayload = {
  jobTitle: string;
  companyName: string;
  jobUrl?: string;
  workMode?: WorkMode;
  status?: ApplicationStatus;
  notes?: string;
};

export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

export async function fetchApplications(query?: ApplicationQueryParams): Promise<ApplicationDto[]> {
  const api = await getApi();
  const { data } = await api.get<ApplicationDto[]>('/applications', { params: query });
  return data;
}

export async function fetchApplicationById(id: string): Promise<ApplicationDto> {
  const api = await getApi();
  const { data } = await api.get<ApplicationDto>(`/applications/${id}`);
  return data;
}

export async function createApplicationRequest(payload: CreateApplicationPayload): Promise<ApplicationDto> {
  const api = await getApi();
  const { data } = await api.post<ApplicationDto>('/applications', payload);
  return data;
}

export async function updateApplicationRequest(id: string, payload: UpdateApplicationPayload): Promise<ApplicationDto> {
  const api = await getApi();
  const { data } = await api.patch<ApplicationDto>(`/applications/${id}`, payload);
  return data;
}

export async function deleteApplicationRequest(id: string): Promise<void> {
  const api = await getApi();
  await api.delete(`/applications/${id}`);
}
