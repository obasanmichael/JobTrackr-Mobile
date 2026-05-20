import type {
  JobBoardDetail,
  JobSearchRequestParams,
  JobSearchResponseApi,
  JobSearchResult,
  JobDetailApiRecord,
  JobMatchItemApi,
  JobSingleMatch,
} from '../types/job-board.dto';
import {
  jobDetailFromApi,
  jobSearchFromApi,
  jobSingleMatchFromApi,
} from '../domain/job-board-mappers';
import { getApi } from './api';

export async function searchJobsRequest(params: JobSearchRequestParams = {}): Promise<JobSearchResult> {
  const api = await getApi();
  const { data } = await api.get<JobSearchResponseApi>('/jobs', {
    params: { ...params },
  });
  return jobSearchFromApi(data);
}

export async function fetchJobByIdRequest(jobId: string): Promise<JobBoardDetail> {
  const api = await getApi();
  const { data } = await api.get<JobDetailApiRecord>(`/jobs/${jobId}`);
  return jobDetailFromApi(data);
}

export async function fetchJobMatchRequest(jobId: string): Promise<JobSingleMatch> {
  const api = await getApi();
  const { data } = await api.get<JobMatchItemApi>(`/jobs/${jobId}/match`);
  return jobSingleMatchFromApi(data);
}
