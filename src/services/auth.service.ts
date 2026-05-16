import type { AuthSessionPayload, UserProfile } from '../types/user';
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schemas';
import { getApi } from './api';

export async function loginRequest(body: LoginFormValues): Promise<AuthSessionPayload> {
  const api = await getApi();
  const { data } = await api.post<AuthSessionPayload>('/auth/login', body, { skipAuth: true });
  return data;
}

export async function registerRequest(body: RegisterFormValues): Promise<AuthSessionPayload> {
  const api = await getApi();
  const { data } = await api.post<AuthSessionPayload>('/auth/register', body, { skipAuth: true });
  return data;
}

export async function getCurrentUserRequest(): Promise<UserProfile> {
  const api = await getApi();
  const { data } = await api.get<UserProfile>('/auth/me');
  return data;
}
