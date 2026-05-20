import type { CreateApplicationPayload } from '../services/applications.service';
import type { WorkMode } from '../constants/work-mode';
import type { JobBoardDetail } from '../types/job-board.dto';

const WORK_MODES = new Set<WorkMode>(['REMOTE', 'HYBRID', 'ONSITE', 'UNSPECIFIED']);

export function jobDetailToCreateApplicationPayload(
  job: JobBoardDetail,
): CreateApplicationPayload {
  const workMode =
    job.workMode && WORK_MODES.has(job.workMode as WorkMode)
      ? (job.workMode as WorkMode)
      : undefined;

  const sourceLabel = job.sourceMeta?.name ?? job.source;

  return {
    jobTitle: job.title,
    companyName: job.companyName,
    status: 'SAVED',
    jobUrl: job.applyUrl ?? undefined,
    location: job.location ?? undefined,
    workMode,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    currency: job.currency ?? undefined,
    source: 'OTHER',
    notes: sourceLabel ? `Discovered via ${sourceLabel}` : undefined,
  };
}
