import type { JobSearchRequestParams, JobSearchResponseApi, JobSearchResult } from '../types/job-board.dto';
import { jobSearchFromApi } from '../domain/job-board-mappers';
import { getApi } from './api';

export async function searchJobsRequest(params: JobSearchRequestParams = {}): Promise<JobSearchResult> {
  const api = await getApi();
  const { data } = await api.get<JobSearchResponseApi>('/jobs', {
    params: { ...params },
  });
  return jobSearchFromApi(data);
}
