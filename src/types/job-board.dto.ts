export interface JobListingSourceMetaApi {
  name: string;
  type: string;
}

export interface JobListingApiRecord {
  id: string;
  title: string;
  companyName: string;
  location?: string | null;
  workMode?: string | null;
  applyUrl?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  source?: string | null;
  sourceMeta?: JobListingSourceMetaApi | null;
  postedAt?: string | null;
  excerpt?: string | null;
}

export interface JobDetailApiRecord extends JobListingApiRecord {
  description?: string | null;
  requirements?: string | null;
  experienceLevel?: string | null;
  employmentType?: string | null;
  country?: string | null;
}

export interface JobSearchResponseApi {
  jobs: JobListingApiRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface JobBoardListing {
  id: string;
  title: string;
  companyName: string;
  location?: string | null;
  workMode?: string | null;
  applyUrl?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  source?: string | null;
  sourceMeta?: JobListingSourceMetaApi | null;
  postedAt?: string | null;
  excerpt?: string | null;
}

export interface JobBoardDetail extends JobBoardListing {
  description?: string | null;
  requirements?: string | null;
  experienceLevel?: string | null;
  employmentType?: string | null;
  country?: string | null;
}

export interface JobSingleMatch {
  overallScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  requiresProfile: boolean;
  titleScore: number;
  skillScore: number;
  experienceScore: number;
  locationScore: number;
  recencyScore: number;
  job: JobBoardListing;
}

export interface JobSearchResult {
  jobs: JobBoardListing[];
  total: number;
  page: number;
  limit: number;
}

export interface JobSearchRequestParams {
  q?: string;
  location?: string;
  workMode?: string;
  experienceLevel?: string;
  salaryMin?: number;
  source?: string;
  postedWithin?: number;
  page?: number;
  limit?: number;
}

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
  requiresProfile?: boolean;
  job: JobListingApiRecord;
}
