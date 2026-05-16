import { format } from 'date-fns';

import type { ApplicationListItem } from './application-display';
import type { ApplicationDto } from '../types/application.dto';

function formatSalaryLine(
  min?: number | null,
  max?: number | null,
  currencyRaw?: string | null,
): string | undefined {
  const currency = (currencyRaw ?? 'USD').trim() || 'USD';
  const fmtMoney = (n: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  if (min != null && max != null && min !== max) {
    return `${fmtMoney(min)} – ${fmtMoney(max)}`;
  }
  const single = min ?? max;
  return single != null ? fmtMoney(single) : undefined;
}

export function applicationDtoToListItem(dto: ApplicationDto): ApplicationListItem {
  const deadline = dto.deadline ? new Date(dto.deadline) : null;

  let deadlineLabel: string | undefined;
  if (deadline && !Number.isNaN(+deadline)) {
    deadlineLabel = `Due · ${format(deadline, 'MMM d, yyyy')}`;
  }

  const created = dto.createdAt ? new Date(dto.createdAt) : null;
  const appliedLabel =
    created && !Number.isNaN(+created) ? `Added · ${format(created, 'MMM d')}` : undefined;

  const notesTrimmed = dto.notes?.trim();
  const notesPreview =
    notesTrimmed && notesTrimmed.length > 160 ? `${notesTrimmed.slice(0, 157)}…` : notesTrimmed;

  return {
    id: dto.id,
    jobTitle: dto.jobTitle,
    companyName: dto.companyName,
    status: dto.status,
    workMode: dto.workMode,
    location: dto.location ?? undefined,
    salaryRange: formatSalaryLine(dto.salaryMin, dto.salaryMax, dto.currency),
    appliedLabel,
    deadlineLabel,
    notesPreview: notesPreview ?? undefined,
  };
}
