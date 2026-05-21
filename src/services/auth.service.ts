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

export async function changePasswordRequest(body: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const api = await getApi();
  const { data } = await api.post<{ message: string }>('/auth/change-password', body);
  return data;
}

export async function forgotPasswordRequest(body: {
  email: string;
}): Promise<{ message: string }> {
  const api = await getApi();
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', body, {
    skipAuth: true,
  });
  return data;
}
