import type { CandidateProfileDto, ResumeDto } from '../types/resume.dto';
import {
  candidateProfileFromApi,
  resumeFromApi,
  type CandidateProfileApiRecord,
  type ResumeApiRecord,
} from '../domain/resume-mappers';
import { getPublicApiBaseUrl } from '../config/env';
import { normalizeApiPayload } from './api-error';
import { getApi } from './api';
import { getStoredAccessToken } from '../storage/token-storage';

export async function fetchResumes(): Promise<ResumeDto[]> {
  const api = await getApi();
  const { data } = await api.get<ResumeApiRecord[]>('/resumes');
  return data.map(resumeFromApi);
}

export async function fetchResumeById(id: string): Promise<ResumeDto> {
  const api = await getApi();
  const { data } = await api.get<ResumeApiRecord>(`/resumes/${id}`);
  return resumeFromApi(data);
}

export async function postResumeSetActive(id: string): Promise<ResumeDto> {
  const api = await getApi();
  const { data } = await api.post<ResumeApiRecord>(`/resumes/${id}/set-active`);
  return resumeFromApi(data);
}

export async function fetchCandidateProfile(resumeId: string): Promise<CandidateProfileDto> {
  const api = await getApi();
  const { data } = await api.get<CandidateProfileApiRecord>(`/resumes/${resumeId}/profile`);
  return candidateProfileFromApi(data);
}

export type UploadablePick = { uri: string; name: string; mimeType: string | null };

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

/** Multipart upload, uses `fetch` so React Native sets the multipart boundary correctly. */
export async function uploadResumeFile(file: UploadablePick): Promise<ResumeDto> {
  const baseURL = getPublicApiBaseUrl();
  if (!baseURL) throw new Error('EXPO_PUBLIC_API_URL is required for uploads.');

  const token = await getStoredAccessToken();
  const url = `${baseURL}/resumes/upload`;

  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name || 'resume',
    type: file.mimeType || 'application/octet-stream',
  } as unknown as Blob);

  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : { Accept: 'application/json' },
    body: form,
  });

  if (!res.ok) {
    throw new Error(await readUploadFailureMessage(res));
  }

  const data = (await res.json()) as ResumeApiRecord;
  return resumeFromApi(data);
}
