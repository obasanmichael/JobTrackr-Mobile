export type ScheduleEventKind = 'interview' | 'reminder';

export type ScheduleViewMode = 'month' | 'week';

export type ScheduleEvent = {
  id: string;
  kind: ScheduleEventKind;
  title: string;
  subtitle?: string;
  start: Date;
  end: Date;
  applicationId: string;
  completed?: boolean;
};
