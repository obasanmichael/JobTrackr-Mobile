import type { JobListingApiRecord } from './job-board.dto';

export interface JobMatchItemApi {
  overallScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  titleScore: number;
  skillScore: number;
  experienceScore: number;
  locationScore: number;
  recencyScore: number;
  job: JobListingApiRecord;
}

export interface JobMatchListResponseApi {
  matches: JobMatchItemApi[];
  total: number;
  requiresProfile: boolean;
  generatedAt?: string | null;
}

export interface MatchedJobListing {
  overallScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  job: {
    id: string;
    title: string;
    companyName: string;
    location?: string | null;
    workMode?: string | null;
    applyUrl?: string | null;
    source?: string | null;
    postedAt?: string | null;
    excerpt?: string | null;
  };
}

export interface MatchedJobsResult {
  matches: MatchedJobListing[];
  total: number;
  requiresProfile: boolean;
  generatedAt?: string | null;
}
