/** Mirrors Nest `InterviewStage` / Prisma literal order — uppercase strings round-trip unchanged. */

export const INTERVIEW_STAGES = [
  'RECRUITER_SCREEN',
  'TECHNICAL_INTERVIEW',
  'TECHNICAL_ASSESSMENT',
  'HIRING_MANAGER',
  'FINAL_INTERVIEW',
  'OFFER_DISCUSSION',
  'OTHER',
] as const;
export type InterviewStageId = (typeof INTERVIEW_STAGES)[number];

export const INTERVIEW_STAGE_LABELS: Record<InterviewStageId, string> = {
  RECRUITER_SCREEN: 'Recruiter screen',
  TECHNICAL_INTERVIEW: 'Technical interview',
  TECHNICAL_ASSESSMENT: 'Technical assessment',
  HIRING_MANAGER: 'Hiring manager',
  FINAL_INTERVIEW: 'Final interview',
  OFFER_DISCUSSION: 'Offer discussion',
  OTHER: 'Interview',
};

export const INTERVIEW_TYPES = ['PHONE', 'VIDEO', 'ONSITE', 'TAKE_HOME', 'LIVE_CODING', 'OTHER'] as const;
export type InterviewTypeId = (typeof INTERVIEW_TYPES)[number];

export const INTERVIEW_TYPE_LABELS: Record<InterviewTypeId, string> = {
  PHONE: 'Phone',
  VIDEO: 'Video',
  ONSITE: 'On-site',
  TAKE_HOME: 'Take-home',
  LIVE_CODING: 'Live coding',
  OTHER: 'Interview',
};
