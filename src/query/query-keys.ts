import type { ApplicationQueryParams } from '../types/application.dto';
import type { JobSearchRequestParams } from '../types/job-board.dto';

/** Stable subset for TanStack caches (omit undefined). */
export function jobSearchStoreKey(filters: JobSearchRequestParams): JobSearchRequestParams {
  const out: JobSearchRequestParams = {};
  if (filters.q?.trim()) out.q = filters.q.trim();
  if (filters.location?.trim()) out.location = filters.location.trim();
  if (filters.workMode && filters.workMode !== 'UNSPECIFIED') out.workMode = filters.workMode;
  out.page = filters.page ?? 1;
  out.limit = filters.limit ?? 20;
  return out;
}

export function applicationsListStoreKey(filters: Partial<ApplicationQueryParams>): ApplicationQueryParams {
  return {
    search: filters.search?.trim() || undefined,
    sort: filters.sort,
    status: filters.status,
  };
}

/** All keys are prefixed for broad invalidations via `invalidateQueries({ queryKey: jtKeys.root })`. */
export const jtKeys = {
  root: ['jobtrackr'] as const,

  dashboard: () => [...jtKeys.root, 'dashboardSummary'] as const,

  applications: () => [...jtKeys.root, 'applications'] as const,
  applicationsList: (filters: ApplicationQueryParams = {}) =>
    [...jtKeys.applications(), 'list', applicationsListStoreKey(filters)] as const,
  application: (id: string) => [...jtKeys.applications(), 'detail', id] as const,

  reminders: () => [...jtKeys.root, 'reminders'] as const,

  interviews: () => [...jtKeys.root, 'interviews'] as const,

  timeline: (applicationId: string) => [...jtKeys.root, 'applicationTimeline', applicationId] as const,

  jobsSearch: (filters: JobSearchRequestParams) =>
    [...jtKeys.root, 'jobs', 'search', jobSearchStoreKey(filters)] as const,

  resumes: () => [...jtKeys.root, 'resumes'] as const,
  resume: (id: string) => [...jtKeys.resumes(), 'detail', id] as const,
  candidateProfile: (resumeId: string) => [...jtKeys.resumes(), resumeId, 'candidateProfile'] as const,
};
