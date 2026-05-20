import type { MatchedJobsResult } from '../types/matched-jobs.dto';
import { matchedJobsFromApi } from '../domain/matched-jobs-mappers';
import type { JobMatchListResponseApi } from '../types/matched-jobs.dto';
import { getApi } from './api';

export async function fetchMatchedJobsRequest(): Promise<MatchedJobsResult> {
  const api = await getApi();
  const { data } = await api.get<JobMatchListResponseApi>('/matches');
  return matchedJobsFromApi(data);
}

export async function generateMatchedJobsRequest(): Promise<MatchedJobsResult> {
  const api = await getApi();
  const { data } = await api.post<JobMatchListResponseApi>('/matches/generate');
  return matchedJobsFromApi(data);
}
