/** Aligns with backend enum naming (PRD §12.3). */
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE' | 'UNSPECIFIED';

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
  UNSPECIFIED: 'Location TBD',
};
