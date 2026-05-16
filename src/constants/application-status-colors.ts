import type { ApplicationStatus } from './application-status';

/** Matches `STATUS_CHART_COLORS` job-trackr-frontend/src/lib/chart-colors.ts (JOBTRACKR web). */
export const APPLICATION_STATUS_CHART_FG: Record<ApplicationStatus, string> = {
  SAVED: '#94a3b8',
  APPLIED: '#3b82f6',
  SCREENING: '#8b5cf6',
  INTERVIEW: '#f59e0b',
  TECHNICAL_ASSESSMENT: '#f97316',
  FINAL_INTERVIEW: '#14b8a6',
  OFFER: '#22c55e',
  REJECTED: '#ef4444',
  WITHDRAWN: '#6b7280',
};

export type ThemeModeLite = 'light' | 'dark';

/** Soft tinted chip background behind status label (opaque hex + alpha suffix). */
export function applicationStatusMutedSurface(fgHex: string, mode: ThemeModeLite): string {
  return `${fgHex}${mode === 'dark' ? '33' : '22'}`;
}
