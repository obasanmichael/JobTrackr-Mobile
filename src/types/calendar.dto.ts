export type CalendarProvider = 'GOOGLE';

export type CalendarEventSyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

export type CalendarStatusApi = {
  provider: CalendarProvider | null;
  connected: boolean;
  providerAccountEmail?: string | null;
  lastSyncAt?: string | null;
  lastError?: string | null;
  autoSyncInterviews: boolean;
};

export type CalendarConnectApi = {
  authorizationUrl: string;
};

export type PatchCalendarSettingsInput = {
  autoSyncInterviews?: boolean;
};

export type SyncInterviewsInput = {
  interviewId?: string;
};

export type CalendarSyncResultItemApi = {
  interviewId: string;
  syncStatus: CalendarEventSyncStatus;
  providerEventId?: string | null;
  error?: string | null;
};

export type SyncInterviewsApi = {
  results: CalendarSyncResultItemApi[];
  syncedCount: number;
  failedCount: number;
};
