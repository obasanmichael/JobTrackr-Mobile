import * as SecureStore from 'expo-secure-store';
import { saveJobRequest } from './saved-jobs.service';

const LEGACY_KEY = 'jobtrackr_saved_job_ids';
const MIGRATION_FLAG_KEY = 'jobtrackr_saved_jobs_migrated_api_v1';

async function readLegacyIds(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(LEGACY_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

/**
 * One-time migration from SecureStore bookmark ids to `POST /saved-jobs`.
 */
export async function migrateLegacySavedJobIdsOnce(): Promise<void> {
  const flag = await SecureStore.getItemAsync(MIGRATION_FLAG_KEY);
  if (flag) {
    return;
  }
  const ids = await readLegacyIds();
  if (ids.length === 0) {
    await SecureStore.setItemAsync(MIGRATION_FLAG_KEY, '1');
    return;
  }
  await Promise.all(
    ids.map(async (externalJobId) => {
      try {
        await saveJobRequest(externalJobId);
      } catch {
        /* stale id */
      }
    }),
  );
  await SecureStore.deleteItemAsync(LEGACY_KEY);
  await SecureStore.setItemAsync(MIGRATION_FLAG_KEY, '1');
}
