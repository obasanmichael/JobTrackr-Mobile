import type {
  JobBoardDetail,
  JobBoardListing,
  JobDetailApiRecord,
  JobListingApiRecord,
  JobMatchItemApi,
  JobSearchResponseApi,
  JobSearchResult,
  JobSingleMatch,
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
    sourceMeta: record.sourceMeta ?? null,
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

export function jobDetailFromApi(raw: JobDetailApiRecord): JobBoardDetail {
  return {
    ...jobFromApi(raw),
    description: raw.description,
    requirements: raw.requirements,
    experienceLevel: raw.experienceLevel,
    employmentType: raw.employmentType,
    country: raw.country,
  };
}

export function jobSingleMatchFromApi(raw: JobMatchItemApi): JobSingleMatch {
  return {
    overallScore: raw.overallScore,
    matchReason: raw.matchReason,
    matchedSkills: raw.matchedSkills,
    missingSkills: raw.missingSkills,
    requiresProfile: raw.requiresProfile ?? false,
    titleScore: raw.titleScore,
    skillScore: raw.skillScore,
    experienceScore: raw.experienceScore,
    locationScore: raw.locationScore,
    recencyScore: raw.recencyScore,
    job: jobFromApi(raw.job),
  };
}
