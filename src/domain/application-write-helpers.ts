import type { ApplicationStatus } from '../constants/application-status';
import type { ApplicationCurrency } from '../constants/currency';
import type { JobSource } from '../constants/job-source';
import type { WorkMode } from '../constants/work-mode';
import type { CreateApplicationPayload } from '../services/applications.service';

export type ApplicationWriteAlert = { title: string; message: string };

export type ApplicationWriteFormInput = {
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  status: ApplicationStatus;
  location: string;
  workMode: WorkMode;
  salaryMinStr: string;
  salaryMaxStr: string;
  currency: ApplicationCurrency;
  source: JobSource;
  deadlineDateStr: string;
  notes: string;
  /** Quick add collapsed path omits extras; edit always sends full comparable body. */
  includeExtras: boolean;
};

export function deadlineInputToIso(trimmed: string): 'invalid-format' | 'invalid-date' | string {
  if (!trimmed) return 'invalid-format';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return 'invalid-format';
  const d = new Date(`${trimmed}T12:00:00`);
  return Number.isNaN(+d) ? 'invalid-date' : d.toISOString();
}

export function parseSalaryAmount(raw: string): number | undefined {
  const n = Number(raw.trim());
  if (!raw.trim()) return undefined;
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

/** Shared create / PATCH body aligned with Nest + web mapper. */
export function buildApplicationWritePayload(
  input: ApplicationWriteFormInput,
): { ok: true; payload: CreateApplicationPayload } | { ok: false; alert: ApplicationWriteAlert } {
  const trimmedRole = input.jobTitle.trim();
  const trimmedCompany = input.companyName.trim();
  const trimmedUrl = input.jobUrl.trim();

  if (!trimmedRole || !trimmedCompany) {
    return {
      ok: false,
      alert: { title: 'Missing fields', message: 'Add a job title and company before saving.' },
    };
  }

  let deadlineIso: string | undefined;
  if (input.includeExtras && input.deadlineDateStr.trim()) {
    const parsed = deadlineInputToIso(input.deadlineDateStr.trim());
    if (parsed === 'invalid-format') {
      return {
        ok: false,
        alert: { title: 'Deadline format', message: 'Use YYYY-MM-DD (for example 2026-06-01).' },
      };
    }
    if (parsed === 'invalid-date') {
      return { ok: false, alert: { title: 'Deadline', message: 'That date isn’t valid. Please fix it.' } };
    }
    deadlineIso = parsed;
  }

  let minAmt: number | undefined;
  let maxAmt: number | undefined;
  if (input.includeExtras) {
    minAmt = parseSalaryAmount(input.salaryMinStr);
    maxAmt = parseSalaryAmount(input.salaryMaxStr);
    if (
      (input.salaryMinStr.trim() && minAmt === undefined) ||
      (input.salaryMaxStr.trim() && maxAmt === undefined)
    ) {
      return {
        ok: false,
        alert: {
          title: 'Salary',
          message: 'Enter valid numbers for salary (or leave both empty).',
        },
      };
    }
    if (
      input.salaryMinStr.trim() &&
      input.salaryMaxStr.trim() &&
      minAmt !== undefined &&
      maxAmt !== undefined &&
      minAmt > maxAmt
    ) {
      return {
        ok: false,
        alert: {
          title: 'Salary range',
          message: 'Minimum salary cannot be greater than maximum.',
        },
      };
    }
  }

  const payload: CreateApplicationPayload = {
    jobTitle: trimmedRole,
    companyName: trimmedCompany,
    status: input.status,
  };
  if (trimmedUrl) payload.jobUrl = trimmedUrl;

  if (!input.includeExtras) {
    return { ok: true, payload };
  }

  if (input.location.trim()) payload.location = input.location.trim();
  if (input.workMode !== 'UNSPECIFIED') payload.workMode = input.workMode;
  if (minAmt !== undefined) payload.salaryMin = minAmt;
  if (maxAmt !== undefined) payload.salaryMax = maxAmt;
  if (input.salaryMinStr.trim() || input.salaryMaxStr.trim()) payload.currency = input.currency;

  payload.source = input.source;
  if (deadlineIso) payload.deadline = deadlineIso;
  if (input.notes.trim()) payload.notes = input.notes.trim();

  return { ok: true, payload };
}
