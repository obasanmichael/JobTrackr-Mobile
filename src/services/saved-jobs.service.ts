import type {
  ConvertSavedJobResponseApi,
  SavedJobDto,
  SavedJobsListResponseApi,
} from '../types/saved-jobs.dto';
import { getApi } from './api';

export async function fetchSavedJobsBookmarksRequest(): Promise<SavedJobsListResponseApi> {
  const api = await getApi();
  const { data } = await api.get<SavedJobsListResponseApi>('/saved-jobs', {
    params: {
      page: 1,
      limit: 500,
      includeConverted: true,
    },
  });
  return data;
}

export async function saveJobRequest(externalJobId: string): Promise<SavedJobDto> {
  const api = await getApi();
  const { data } = await api.post<SavedJobDto>('/saved-jobs', { externalJobId });
  return data;
}

export async function deleteSavedJobRequest(savedJobId: string): Promise<void> {
  const api = await getApi();
  await api.delete(`/saved-jobs/${savedJobId}`);
}

export async function convertSavedJobRequest(
  savedJobId: string,
  body: { notesAppend?: string } = {},
): Promise<ConvertSavedJobResponseApi> {
  const api = await getApi();
  const { data } = await api.post<ConvertSavedJobResponseApi>(
    `/saved-jobs/${savedJobId}/convert-to-application`,
    body,
  );
  return data;
}
