/** Backend job source enums (aligned with Nest + web mapper). */
export const JOB_SOURCES = [
  'LINKEDIN',
  'COMPANY_WEBSITE',
  'REFERRAL',
  'INDEED',
  'TWITTER',
  'EMAIL',
  'OTHER',
] as const;

export type JobSource = (typeof JOB_SOURCES)[number];

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  LINKEDIN: 'LinkedIn',
  COMPANY_WEBSITE: 'Company site',
  REFERRAL: 'Referral',
  INDEED: 'Indeed',
  TWITTER: 'Twitter/X',
  EMAIL: 'Email',
  OTHER: 'Other',
};
