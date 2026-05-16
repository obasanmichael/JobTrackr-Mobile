import type { InterviewDto } from '../types/interview.dto';
import { getApi } from './api';

export async function fetchInterviews(): Promise<InterviewDto[]> {
  const api = await getApi();
  const { data } = await api.get<InterviewDto[]>('/interviews');
  return data;
}
