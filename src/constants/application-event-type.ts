export const EVENT_TYPES = [
  'STATUS_CHANGE',
  'NOTE',
  'RECRUITER_UPDATE',
  'INTERVIEW_UPDATE',
  'REMINDER_CREATED',
  'GENERAL_UPDATE',
] as const;

export type ApplicationEventType = (typeof EVENT_TYPES)[number];
