import type {
  CreateJobSourceSubmissionPayload,
  JobSourceSubmissionDto,
} from '../types/job-source-submission.dto';
import { getApi } from './api';

export async function createJobSourceSubmissionRequest(
  payload: CreateJobSourceSubmissionPayload,
): Promise<JobSourceSubmissionDto> {
  const api = await getApi();
  const { data } = await api.post<JobSourceSubmissionDto>(
    '/job-source-submissions',
    payload,
  );
  return data;
}
