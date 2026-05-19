import type {
  JobBoardListing,
  JobListingApiRecord,
  JobSearchResponseApi,
  JobSearchResult,
} from '../types/job-board.dto';

function jobFromApi(record: JobListingApiRecord): JobBoardListing {
  return {
    id: record.id,
    title: record.title,
    companyName: record.companyName,
    location: record.location,
    workMode: record.workMode,
    applyUrl: record.applyUrl,
    salaryMin: record.salaryMin,
    salaryMax: record.salaryMax,
    currency: record.currency,
    source: record.source,
    postedAt: record.postedAt,
    excerpt: record.excerpt,
  };
}

export function jobSearchFromApi(raw: JobSearchResponseApi): JobSearchResult {
  return {
    jobs: raw.jobs.map(jobFromApi),
    total: raw.total,
    page: raw.page,
    limit: raw.limit,
  };
}
