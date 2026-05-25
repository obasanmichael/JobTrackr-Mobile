import type { InterviewDto } from '../types/interview.dto';
import type { InterviewStageId, InterviewTypeId } from '../constants/interview-metadata';
import { getApi } from './api';

export type CreateInterviewPayload = {
  applicationId: string;
  stage: InterviewStageId;
  interviewType: InterviewTypeId;
  scheduledAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  outcome?: string;
};

export type PatchInterviewPayload = {
  stage?: InterviewStageId;
  interviewType?: InterviewTypeId;
  scheduledAt?: string;
  location?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  outcome?: string | null;
};

export async function fetchInterviews(): Promise<InterviewDto[]> {
  const api = await getApi();
  const { data } = await api.get<InterviewDto[]>('/interviews');
  return data;
}

export async function createInterview(payload: CreateInterviewPayload): Promise<InterviewDto> {
  const api = await getApi();
  const { data } = await api.post<InterviewDto>('/interviews', payload);
  return data;
}

export async function patchInterview(id: string, payload: PatchInterviewPayload): Promise<InterviewDto> {
  const api = await getApi();
  const { data } = await api.patch<InterviewDto>(`/interviews/${id}`, payload);
  return data;
}

export async function deleteInterview(id: string): Promise<void> {
  const api = await getApi();
  await api.delete(`/interviews/${id}`);
}
