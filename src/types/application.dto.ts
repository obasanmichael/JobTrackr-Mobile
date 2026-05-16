import type { ApplicationStatus } from '../constants/application-status';
import type { WorkMode } from '../constants/work-mode';

/** JSON shape returned by Nest for `JobApplication` */
export type ApplicationDto = {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  jobUrl?: string | null;
  location?: string | null;
  workMode: WorkMode;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  status: ApplicationStatus;
  source?: string | null;
  deadline?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationQueryParams = {
  status?: ApplicationStatus;
  search?: string;
  sort?: 'deadline' | 'createdAt';
};
