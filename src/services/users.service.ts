import type { UserProfile } from '../types/user';
import { getPublicApiBaseUrl } from '../config/env';
import { normalizeApiPayload } from './api-error';
import { getApi } from './api';
import { getStoredAccessToken } from '../storage/token-storage';

function normalizeUser(raw: UserProfile): UserProfile {
  return {
    ...raw,
    avatarUrl: raw.avatarUrl ?? null,
  };
}

export async function updateUserProfileRequest(payload: {
  name?: string;
  timezone?: string | null;
  themePreference?: 'system' | 'light' | 'dark' | null;
}): Promise<UserProfile> {
  const api = await getApi();
  const { data } = await api.patch<UserProfile>('/users/me', payload);
  return normalizeUser(data);
}

export type UploadableAvatarPick = {
  uri: string;
  name: string;
  mimeType: string | null;
};

async function readUploadFailureMessage(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return `Upload failed (${res.status})`;
  try {
    const parsed: unknown = JSON.parse(text);
    const normalized = normalizeApiPayload(parsed);
    if (normalized?.message) return normalized.message;
  } catch {
    /* plain text body */
  }
  return text;
}

export async function uploadUserAvatarFile(
  file: UploadableAvatarPick,
): Promise<UserProfile> {
  const baseURL = getPublicApiBaseUrl();
  if (!baseURL) throw new Error('EXPO_PUBLIC_API_URL is required for uploads.');

  const token = await getStoredAccessToken();
  const url = `${baseURL}/users/me/avatar`;

  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name || 'avatar',
    type: file.mimeType || 'image/jpeg',
  } as unknown as Blob);

  const res = await fetch(url, {
    method: 'POST',
    headers: token
      ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      : { Accept: 'application/json' },
    body: form,
  });

  if (!res.ok) {
    throw new Error(await readUploadFailureMessage(res));
  }

  const data = (await res.json()) as UserProfile;
  return normalizeUser(data);
}

export async function deleteUserAvatarRequest(): Promise<UserProfile> {
  const api = await getApi();
  const { data } = await api.delete<UserProfile>('/users/me/avatar');
  return normalizeUser(data);
}
