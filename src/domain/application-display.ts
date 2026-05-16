import type { ApplicationStatus } from '../constants/application-status';
import type { WorkMode } from '../constants/work-mode';

/**
 * Card-friendly projection used by scaffold fixtures and API-backed lists.
 */
export type ApplicationListItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  workMode: WorkMode;
  location?: string;
  salaryRange?: string;
  appliedLabel?: string;
  deadlineLabel?: string;
  notesPreview?: string;
};
