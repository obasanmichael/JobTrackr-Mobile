import { format } from 'date-fns';

import type { ApplicationEventDto } from '../types/application-event.dto';

/** One-line headline for timeline list */
export function formatApplicationTimelineLine(event: ApplicationEventDto): string {
  const d = new Date(event.createdAt);
  const stamp = Number.isNaN(+d) ? '—' : format(d, 'MMM d · h:mm a');
  const desc = event.description?.trim();
  if (desc) return `${stamp} · ${event.title} · ${desc}`;
  return `${stamp} · ${event.title}`;
}
