import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import type { ApplicationDto, ApplicationQueryParams } from '../types/application.dto';
import type { DashboardSummaryDto } from '../types/dashboard.dto';
import type { InterviewDto } from '../types/interview.dto';
import type { ReminderDto } from '../types/reminder.dto';
import type { CreateTimelineEventPayload } from '../services/application-events.service';
import { createApplicationEventRequest, fetchApplicationTimeline } from '../services/application-events.service';
import {
  createApplicationRequest,
  deleteApplicationRequest,
  fetchApplicationById,
  fetchApplications,
  updateApplicationRequest,
  type CreateApplicationPayload,
  type UpdateApplicationPayload,
} from '../services/applications.service';
import { fetchDashboardSummary } from '../services/dashboard.service';
import { fetchInterviews } from '../services/interviews.service';
import { fetchReminders, patchReminder } from '../services/reminders.service';
import { fetchJobByIdRequest, fetchJobMatchRequest, searchJobsRequest } from '../services/jobs.service';
import {
  fetchMatchedJobsRequest,
  generateMatchedJobsRequest,
} from '../services/matches.service';
import {
  convertSavedJobRequest,
  deleteSavedJobRequest,
  fetchSavedJobsBookmarksRequest,
  saveJobRequest,
} from '../services/saved-jobs.service';
import { createJobSourceSubmissionRequest } from '../services/job-source-submissions.service';
import type { JobBoardDetail, JobSearchRequestParams, JobSearchResult, JobSingleMatch } from '../types/job-board.dto';
import type { MatchedJobsResult } from '../types/matched-jobs.dto';
import type { SavedJobDto } from '../types/saved-jobs.dto';
import type { CreateJobSourceSubmissionPayload } from '../types/job-source-submission.dto';
import type { ResumeDto } from '../types/resume.dto';
import {
  fetchCandidateProfile,
  fetchResumeById,
  fetchResumes,
  postResumeSetActive,
  uploadResumeFile,
} from '../services/resumes.service';
import { jobSearchStoreKey, jtKeys } from './query-keys';

async function invalidateBuckets(qc: QueryClient): Promise<void> {
  await Promise.all([
    qc.invalidateQueries({ queryKey: jtKeys.dashboard() }),
    qc.invalidateQueries({ queryKey: jtKeys.applications() }),
    qc.invalidateQueries({ queryKey: jtKeys.reminders() }),
    qc.invalidateQueries({ queryKey: jtKeys.interviews() }),
  ]);
}

export function useDashboardSummaryQuery(enabled: boolean) {
  return useQuery<DashboardSummaryDto>({
    queryKey: jtKeys.dashboard(),
    enabled,
    queryFn: fetchDashboardSummary,
  });
}

export function useApplicationsListQuery(enabled: boolean, filters: Partial<ApplicationQueryParams>) {
  return useQuery({
    queryKey: jtKeys.applicationsList(filters),
    enabled,
    queryFn: () => fetchApplications(filters),
  });
}

export function useApplicationDetailQuery(enabled: boolean, id: string) {
  return useQuery({
    queryKey: jtKeys.application(id),
    enabled,
    queryFn: () => fetchApplicationById(id),
  });
}

export function useRemindersQuery(enabled: boolean) {
  return useQuery<ReminderDto[]>({
    queryKey: jtKeys.reminders(),
    enabled,
    queryFn: fetchReminders,
  });
}

export function useInterviewsQuery(enabled: boolean) {
  return useQuery<InterviewDto[]>({
    queryKey: jtKeys.interviews(),
    enabled,
    queryFn: fetchInterviews,
  });
}

export function useApplicationTimelineQuery(enabled: boolean, applicationId: string) {
  return useQuery({
    queryKey: jtKeys.timeline(applicationId),
    enabled,
    queryFn: () => fetchApplicationTimeline(applicationId),
  });
}

export function useCreateApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) => createApplicationRequest(payload),
    onSuccess: () => void invalidateBuckets(qc),
  });
}

export function useUpdateApplicationMutation(applicationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateApplicationPayload) => updateApplicationRequest(applicationId, payload),
    onSuccess: async (updated: ApplicationDto) => {
      qc.setQueryData<ApplicationDto>(jtKeys.application(updated.id), updated);
      await invalidateBuckets(qc);
    },
  });
}

export function useDeleteApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplicationRequest(id),
    onSuccess: () => void invalidateBuckets(qc),
  });
}

export function useCreateTimelineEventMutation(applicationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTimelineEventPayload) =>
      createApplicationEventRequest(applicationId, payload),
    onSuccess: () =>
      void Promise.all([
        qc.invalidateQueries({ queryKey: jtKeys.timeline(applicationId) }),
        invalidateBuckets(qc),
      ]),
  });
}

export function useToggleReminderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      patchReminder(id, { isCompleted }),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: jtKeys.reminders() }),
        qc.invalidateQueries({ queryKey: jtKeys.dashboard() }),
      ]),
  });
}

export function useJobSearchQuery(enabled: boolean, filters: JobSearchRequestParams) {
  const normalized = jobSearchStoreKey(filters);
  return useQuery<JobSearchResult>({
    queryKey: jtKeys.jobsSearch(normalized),
    enabled,
    queryFn: () => searchJobsRequest(normalized),
  });
}

export function useJobDetailQuery(enabled: boolean, jobId: string) {
  return useQuery<JobBoardDetail>({
    queryKey: jtKeys.jobDetail(jobId),
    enabled: enabled && jobId.length > 0,
    queryFn: () => fetchJobByIdRequest(jobId),
  });
}

export function useJobMatchQuery(enabled: boolean, jobId: string) {
  return useQuery<JobSingleMatch>({
    queryKey: jtKeys.jobMatch(jobId),
    enabled: enabled && jobId.length > 0,
    retry: false,
    queryFn: () => fetchJobMatchRequest(jobId),
  });
}

export function useMatchedJobsQuery(enabled: boolean) {
  return useQuery<MatchedJobsResult>({
    queryKey: jtKeys.matchedJobs(),
    enabled,
    queryFn: fetchMatchedJobsRequest,
  });
}

export function useGenerateMatchedJobsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generateMatchedJobsRequest,
    onSuccess: async (result) => {
      qc.setQueryData(jtKeys.matchedJobs(), result);
    },
  });
}

export function useCreateJobSourceSubmissionMutation() {
  return useMutation({
    mutationFn: (payload: CreateJobSourceSubmissionPayload) =>
      createJobSourceSubmissionRequest(payload),
  });
}

export function useResumesQuery(enabled: boolean) {
  return useQuery<ResumeDto[]>({
    queryKey: jtKeys.resumes(),
    enabled,
    queryFn: fetchResumes,
  });
}

export function useResumeDetailQuery(enabled: boolean, resumeId: string) {
  return useQuery({
    queryKey: jtKeys.resume(resumeId),
    enabled: enabled && resumeId.length > 0,
    queryFn: () => fetchResumeById(resumeId),
  });
}

export function useCandidateProfileQuery(enabled: boolean, resumeId: string) {
  return useQuery({
    queryKey: jtKeys.candidateProfile(resumeId),
    enabled: enabled && resumeId.length > 0,
    queryFn: () => fetchCandidateProfile(resumeId),
  });
}

export function useUploadResumeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadResumeFile,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: jtKeys.resumes() });
    },
  });
}

export function useSetActiveResumeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postResumeSetActive,
    onSuccess: async (_, resumeId) => {
      await qc.invalidateQueries({ queryKey: jtKeys.resumes() });
      await qc.invalidateQueries({ queryKey: jtKeys.resume(resumeId) });
    },
  });
}

export function useSavedJobsBookmarksQuery(enabled: boolean) {
  return useQuery({
    queryKey: jtKeys.savedJobsBookmarks(),
    enabled,
    queryFn: fetchSavedJobsBookmarksRequest,
    staleTime: 30_000,
  });
}

export function useToggleSavedJobBookmarkMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobListingId,
      existingRow,
    }: {
      jobListingId: string;
      existingRow: SavedJobDto | undefined;
    }) => {
      if (existingRow && existingRow.status !== 'DISMISSED') {
        await deleteSavedJobRequest(existingRow.id);
        return;
      }
      await saveJobRequest(jobListingId);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: jtKeys.savedJobsBookmarks() });
    },
  });
}

export function useConvertSavedJobMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (savedJobId: string) => convertSavedJobRequest(savedJobId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: jtKeys.savedJobsBookmarks() }),
        invalidateBuckets(qc),
      ]);
    },
  });
}
