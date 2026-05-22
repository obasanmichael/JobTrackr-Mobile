import * as SecureStore from 'expo-secure-store';

/** SecureStore key for JWT, aligns with backend Bearer auth (PRD §11). */
export const ACCESS_TOKEN_STORAGE_KEY = 'jobtrackr_access_token';

export async function getStoredAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setStoredAccessToken(accessToken: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export async function deleteStoredAccessToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    /* idempotent logout */
  }
}
