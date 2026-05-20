import type { ApplicationDto } from './application.dto';
import type { JobDetailApiRecord } from './job-board.dto';

export type SavedJobStatusDto = 'SAVED' | 'DISMISSED' | 'CONVERTED_TO_APPLICATION';

export type SavedJobDto = {
  id: string;
  status: SavedJobStatusDto;
  notes: string | null;
  convertedApplicationId: string | null;
  jobListingId: string;
  createdAt: string;
  updatedAt: string;
  job: JobDetailApiRecord;
};

export type SavedJobsListResponseApi = {
  items: SavedJobDto[];
  total: number;
  page: number;
  limit: number;
};

export type ConvertSavedJobResponseApi = {
  application: ApplicationDto;
  savedJob: SavedJobDto;
};
