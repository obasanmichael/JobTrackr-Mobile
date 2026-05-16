import { format } from 'date-fns';

import type { DashboardReminderItemDto } from '../types/dashboard.dto';
import type { ReminderDto } from '../types/reminder.dto';
import type { ReminderListItem } from './reminder-display';
import type { JobSummaryLookup } from './job-lookup';

function formatDue(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(+d)) return 'Due · —';
  return format(d, 'EEE · MMM d · h:mm a');
}

export function reminderDtoToListItem(dto: ReminderDto, appSummary?: string): ReminderListItem {
  return {
    id: dto.id,
    title: dto.title,
    dueLabel: formatDue(dto.dueDate),
    linkedApplicationSummary: appSummary,
    linkedApplicationId: dto.applicationId,
    completed: dto.isCompleted,
  };
}

export function remindersApplicationSummaryFallback(
  jobTitle?: string | null,
  companyName?: string | null,
): string | undefined {
  if (!jobTitle && !companyName) return undefined;
  if (!jobTitle) return companyName ?? undefined;
  if (!companyName) return jobTitle ?? undefined;
  return `${jobTitle} · ${companyName}`;
}

export function dashboardReminderSliceToItem(
  dto: DashboardReminderItemDto,
  lookup: JobSummaryLookup,
): ReminderListItem {
  const appRef = lookup[dto.applicationId];
  return {
    id: dto.id,
    title: dto.title,
    dueLabel: formatDue(dto.dueDate),
    linkedApplicationSummary: remindersApplicationSummaryFallback(appRef?.jobTitle, appRef?.companyName),
    linkedApplicationId: dto.applicationId,
    completed: false,
  };
}
