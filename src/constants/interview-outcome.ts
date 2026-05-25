export const INTERVIEW_OUTCOMES = ['Passed', 'Failed', 'Pending'] as const;
export type InterviewOutcome = (typeof INTERVIEW_OUTCOMES)[number];
