import type {
  JobMatchListResponseApi,
  MatchedJobsResult,
} from '../types/matched-jobs.dto';
import { jobSearchFromApi } from './job-board-mappers';

export function matchedJobsFromApi(raw: JobMatchListResponseApi): MatchedJobsResult {
  const listings = jobSearchFromApi({
    jobs: raw.matches.map((match) => match.job),
    total: raw.total,
    page: 1,
    limit: raw.total,
  });

  return {
    total: raw.total,
    requiresProfile: raw.requiresProfile,
    generatedAt: raw.generatedAt ?? null,
    matches: raw.matches.map((match, index) => ({
      overallScore: match.overallScore,
      matchReason: match.matchReason,
      matchedSkills: match.matchedSkills ?? [],
      missingSkills: match.missingSkills ?? [],
      job: listings.jobs[index]!,
    })),
  };
}
