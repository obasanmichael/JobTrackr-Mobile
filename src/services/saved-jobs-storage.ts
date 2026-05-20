import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'jobtrackr_saved_job_ids';

async function readIds(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
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

async function writeIds(ids: string[]): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(ids));
}

export async function getSavedJobIds(): Promise<string[]> {
  return readIds();
}

export async function isJobSaved(jobId: string): Promise<boolean> {
  const ids = await readIds();
  return ids.includes(jobId);
}

/** Toggle bookmark; returns true when saved after toggle. */
export async function toggleSavedJobId(jobId: string): Promise<boolean> {
  const ids = await readIds();
  if (ids.includes(jobId)) {
    await writeIds(ids.filter((id) => id !== jobId));
    return false;
  }
  await writeIds([jobId, ...ids]);
  return true;
}
