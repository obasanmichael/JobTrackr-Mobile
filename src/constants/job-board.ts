/** Work mode filter values for aggregated job search — matches web `JOB_BOARD_WORK_MODE_API` / API `WorkMode`. */
export const JOB_BOARD_WORK_MODE_API = [
  { value: 'UNSPECIFIED', label: 'Any' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONSITE', label: 'Onsite' },
] as const;

export type JobBoardWorkModeApi = (typeof JOB_BOARD_WORK_MODE_API)[number]['value'];

export const JOB_BOARD_EXPERIENCE_LEVEL_API = [
  { value: 'UNSPECIFIED', label: 'Any level' },
  { value: 'ENTRY', label: 'Entry' },
  { value: 'MID', label: 'Mid' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'EXECUTIVE', label: 'Executive' },
] as const;

export type JobBoardExperienceLevelApi =
  (typeof JOB_BOARD_EXPERIENCE_LEVEL_API)[number]['value'];

export const JOB_BOARD_POSTED_WITHIN_API = [
  { value: '', label: 'Any time' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
] as const;

export type JobBoardPostedWithinApi = (typeof JOB_BOARD_POSTED_WITHIN_API)[number]['value'];
