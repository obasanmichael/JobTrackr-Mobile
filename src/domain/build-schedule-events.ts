import { addMinutes } from 'date-fns';
import {
  INTERVIEW_STAGE_LABELS,
  INTERVIEW_TYPE_LABELS,
  type InterviewStageId,
  type InterviewTypeId,
} from '../constants/interview-metadata';
import type { ApplicationDto } from '../types/application.dto';
import type { InterviewDto } from '../types/interview.dto';
import type { ReminderDto } from '../types/reminder.dto';
import type { ScheduleEvent } from './schedule-event.types';

const INTERVIEW_DURATION_MINUTES = 60;
const REMINDER_DURATION_MINUTES = 30;

function applicationLabel(
  applicationId: string,
  applicationsById: Map<string, ApplicationDto>,
): { company: string; jobTitle: string } | null {
  const app = applicationsById.get(applicationId);
  if (!app) {
    return null;
  }
  return { company: app.companyName, jobTitle: app.jobTitle };
}

export function buildScheduleEvents(input: {
  interviews: InterviewDto[];
  reminders: ReminderDto[];
  applications: ApplicationDto[];
  includeCompletedReminders?: boolean;
}): ScheduleEvent[] {
  const applicationsById = new Map(input.applications.map((app) => [app.id, app]));
  const events: ScheduleEvent[] = [];

  for (const interview of input.interviews) {
    if (!interview.scheduledAt) {
      continue;
    }
    const start = new Date(interview.scheduledAt);
    if (Number.isNaN(start.getTime())) {
      continue;
    }

    const appInfo = applicationLabel(interview.applicationId, applicationsById);
    const company = appInfo?.company ?? 'Interview';
    const jobTitle = appInfo?.jobTitle;
    const stageLabel =
      INTERVIEW_STAGE_LABELS[interview.stage as InterviewStageId] ?? interview.stage;
    const typeLabel =
      INTERVIEW_TYPE_LABELS[interview.interviewType as InterviewTypeId] ??
      interview.interviewType;

    events.push({
      id: `interview-${interview.id}`,
      kind: 'interview',
      title: `${company} — ${stageLabel}`,
      subtitle: jobTitle ? `${jobTitle} · ${typeLabel}` : typeLabel,
      start,
      end: addMinutes(start, INTERVIEW_DURATION_MINUTES),
      applicationId: interview.applicationId,
    });
  }

  for (const reminder of input.reminders) {
    if (reminder.isCompleted && !input.includeCompletedReminders) {
      continue;
    }
    const start = new Date(reminder.dueDate);
    if (Number.isNaN(start.getTime())) {
      continue;
    }

    const appInfo = applicationLabel(reminder.applicationId ?? '', applicationsById);

    events.push({
      id: `reminder-${reminder.id}`,
      kind: 'reminder',
      title: reminder.title,
      subtitle: appInfo ? `${appInfo.company} · ${appInfo.jobTitle}` : undefined,
      start,
      end: addMinutes(start, REMINDER_DURATION_MINUTES),
      applicationId: reminder.applicationId ?? '',
      completed: reminder.isCompleted,
    });
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
