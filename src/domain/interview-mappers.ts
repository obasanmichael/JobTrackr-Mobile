import { formatIsoForDisplay } from '../lib/datetime-form';
import type { DashboardInterviewItemDto } from '../types/dashboard.dto';
import {
  INTERVIEW_STAGE_LABELS,
  INTERVIEW_TYPE_LABELS,
  type InterviewStageId,
  type InterviewTypeId,
} from '../constants/interview-metadata';
import type { InterviewFormat, InterviewListItem } from './interview-display';
import type { JobSummaryLookup } from './job-lookup';

function interviewTypeToFormat(t: InterviewTypeId): InterviewFormat {
  if (t === 'ONSITE') return 'ONSITE';
  if (t === 'VIDEO' || t === 'PHONE' || t === 'TAKE_HOME' || t === 'LIVE_CODING') return 'REMOTE';
  return 'HYBRID';
}

function scheduledLabel(scheduledIso: string): string {
  return formatIsoForDisplay(scheduledIso, 'EEE · MMM d · h:mm a') ?? '';
}

function durationFromStageTypes(stageRaw: string, typeRaw: string): string {
  const stageOk = stageRaw in INTERVIEW_STAGE_LABELS;
  const typeOk = typeRaw in INTERVIEW_TYPE_LABELS;
  const stage =
    stageOk ? INTERVIEW_STAGE_LABELS[stageRaw as InterviewStageId] : stageRaw.replaceAll('_', ' ');
  const itype =
    typeOk ? INTERVIEW_TYPE_LABELS[typeRaw as InterviewTypeId] : typeRaw.replaceAll('_', ' ');
  return `${stage} · ${itype}`;
}

export function interviewDtoToListItem(dto: InterviewDto, lookup: JobSummaryLookup): InterviewListItem {
  const appRef = lookup[dto.applicationId];
  const roleTitle = appRef?.jobTitle ?? INTERVIEW_STAGE_LABELS[dto.stage] ?? dto.stage;
  const companyName = appRef?.companyName ?? 'Interview';

  return {
    id: dto.id,
    roleTitle,
    companyName,
    startLabel: scheduledLabel(dto.scheduledAt),
    durationLabel: durationFromStageTypes(dto.stage, dto.interviewType),
    format: interviewTypeToFormat(dto.interviewType as InterviewTypeId),
    linkedApplicationId: dto.applicationId,
  };
}

export function dashboardInterviewSliceToItem(
  dto: DashboardInterviewItemDto,
  lookup: JobSummaryLookup,
): InterviewListItem {
  const appRef = lookup[dto.applicationId];
  const roleTitle =
    appRef?.jobTitle ?? INTERVIEW_STAGE_LABELS[dto.stage as InterviewStageId] ?? dto.stage;
  const companyName = appRef?.companyName ?? 'Interview';

  return {
    id: dto.id,
    roleTitle,
    companyName,
    startLabel: scheduledLabel(dto.scheduledAt),
    durationLabel: durationFromStageTypes(dto.stage, dto.interviewType),
    format: interviewTypeToFormat(dto.interviewType as InterviewTypeId),
    linkedApplicationId: dto.applicationId,
  };
}
