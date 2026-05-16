import type { InterviewStageId, InterviewTypeId } from '../constants/interview-metadata';

export type InterviewDto = {
  id: string;
  userId: string;
  applicationId: string;
  stage: InterviewStageId;
  interviewType: InterviewTypeId;
  scheduledAt: string;
  location?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  outcome?: string | null;
  createdAt: string;
  updatedAt: string;
};
