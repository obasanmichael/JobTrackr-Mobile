import type { ApplicationQueryParams } from '../types/application.dto';

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
};
