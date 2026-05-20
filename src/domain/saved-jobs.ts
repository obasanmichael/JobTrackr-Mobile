import type { SavedJobDto } from '../types/saved-jobs.dto';

export function findBookmarkForJobListingId(
  items: SavedJobDto[],
  jobListingId: string,
): SavedJobDto | undefined {
  return items.find((row) => row.jobListingId === jobListingId);
}

/** Saved or converted rows (excludes dismissed-only appearances). */
export function isBookmarkRowActive(row: SavedJobDto | undefined): boolean {
  if (!row) {
    return false;
  }
  return row.status !== 'DISMISSED';
}
