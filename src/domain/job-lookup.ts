import type { ApplicationDto } from '../types/application.dto';

export type JobSummaryLookup = Record<
  string,
  { jobTitle: string; companyName: string } | undefined
>;

export function buildJobSummaryLookup(rows: ApplicationDto[] | undefined): JobSummaryLookup {
  const lookup: JobSummaryLookup = {};
  rows?.forEach((a) => {
    lookup[a.id] = { jobTitle: a.jobTitle, companyName: a.companyName };
  });
  return lookup;
}
