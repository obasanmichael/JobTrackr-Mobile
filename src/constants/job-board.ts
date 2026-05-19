/** Work mode filter values for aggregated job search — matches web `JOB_BOARD_WORK_MODE_API` / API `WorkMode`. */
export const JOB_BOARD_WORK_MODE_API = [
  { value: 'UNSPECIFIED', label: 'Any' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONSITE', label: 'Onsite' },
] as const;

export type JobBoardWorkModeApi = (typeof JOB_BOARD_WORK_MODE_API)[number]['value'];
