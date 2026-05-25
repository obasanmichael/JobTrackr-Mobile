import { format, isValid, parseISO } from 'date-fns';

/** Split an ISO timestamp into date/time parts for mobile pickers. */
export function splitIsoForPickers(iso: string): { dateYmd: string; timeHm: string } {
  const parsed = parseISO(iso);
  if (!isValid(parsed)) {
    const now = new Date();
    return { dateYmd: format(now, 'yyyy-MM-dd'), timeHm: format(now, 'HH:mm') };
  }
  return { dateYmd: format(parsed, 'yyyy-MM-dd'), timeHm: format(parsed, 'HH:mm') };
}

/** Combine yyyy-MM-dd and HH:mm into an ISO string (local wall time). */
export function combineDateAndTimeToIso(dateYmd: string, timeHm: string): string {
  const datePart = dateYmd.trim();
  const timePart = timeHm.trim() || '09:00';
  const parsed = parseISO(`${datePart}T${timePart}:00`);
  if (!isValid(parsed)) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

export function formatIsoForDisplay(
  iso: string,
  pattern = 'MMM d, yyyy · h:mm a',
): string | null {
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return null;
  return format(parsed, pattern);
}
