export type DashboardReminderItemDto = {
  id: string;
  applicationId: string;
  title: string;
  dueDate: string;
};

export type DashboardInterviewItemDto = {
  id: string;
  applicationId: string;
  stage: string;
  interviewType: string;
  scheduledAt: string;
};

export type DashboardRecentEventDto = {
  id: string;
  applicationId: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
};

export type DashboardSummaryDto = {
  totalApplications: number;
  activeApplications: number;
  offerCount: number;
  rejectionCount: number;
  applicationsByStatus: Record<string, number>;
  upcomingReminders: DashboardReminderItemDto[];
  upcomingInterviews: DashboardInterviewItemDto[];
  recentEvents: DashboardRecentEventDto[];
};
