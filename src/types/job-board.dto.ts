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
  postedAt?: string | null;
  excerpt?: string | null;
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
  postedAt?: string | null;
  excerpt?: string | null;
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
  page?: number;
  limit?: number;
}
