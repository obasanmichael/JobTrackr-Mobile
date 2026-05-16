import { format, isValid, parseISO } from 'date-fns';

import { APPLICATION_CURRENCIES } from '../constants/currency';
import { JOB_SOURCES, type JobSource } from '../constants/job-source';
import type { ApplicationDto } from '../types/application.dto';

function normalizeCurrency(currencyRaw?: string | null): (typeof APPLICATION_CURRENCIES)[number] {
  const raw = currencyRaw?.trim().toUpperCase();
  const allowed = APPLICATION_CURRENCIES as unknown as readonly string[];
  return (raw && allowed.includes(raw) ? raw : 'USD') as (typeof APPLICATION_CURRENCIES)[number];
}

function normalizeSource(sourceRaw?: string | null): JobSource {
  const raw = sourceRaw?.trim();
  return (JOB_SOURCES as readonly string[]).includes(raw ?? '') ? (raw as JobSource) : 'OTHER';
}

/** Map API record into mobile application form state (defaults match quick-add UX). */
export function applicationDtoToFormDraft(dto: ApplicationDto): {
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  status: ApplicationDto['status'];
  location: string;
  workMode: ApplicationDto['workMode'];
  salaryMinStr: string;
  salaryMaxStr: string;
  currency: (typeof APPLICATION_CURRENCIES)[number];
  source: JobSource;
  deadlineDateStr: string;
  notes: string;
} {
  const deadlineRaw = dto.deadline ? parseISO(dto.deadline) : null;
  const deadlineDateStr =
    deadlineRaw && isValid(deadlineRaw) ? format(deadlineRaw, 'yyyy-MM-dd') : '';

  return {
    jobTitle: dto.jobTitle,
    companyName: dto.companyName,
    jobUrl: dto.jobUrl?.trim() ?? '',
    status: dto.status,
    location: dto.location?.trim() ?? '',
    workMode: dto.workMode,
    salaryMinStr: dto.salaryMin != null ? String(dto.salaryMin) : '',
    salaryMaxStr: dto.salaryMax != null ? String(dto.salaryMax) : '',
    currency: normalizeCurrency(dto.currency),
    source: normalizeSource(dto.source),
    deadlineDateStr,
    notes: dto.notes?.trim() ?? '',
  };
}
