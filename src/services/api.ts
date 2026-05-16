import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { getPublicApiBaseUrl } from '../config/env';
import { normalizeApiPayload, formatNetworkErrorFallback, type NormalizedApiError } from './api-error';
import { invokeUnauthorized } from './api-unauthorized';
import { getStoredAccessToken } from '../storage/token-storage';

const REQUEST_TIMEOUT_MS = 15_000;

export async function bootstrapApiRuntime(): Promise<AxiosInstance> {
  const baseURL = getPublicApiBaseUrl();
  if (!baseURL) {
    console.warn(
      '[api] Running without API base URL — authenticated calls will fail until EXPO_PUBLIC_API_URL is set.',
    );
  }

  const instance = axios.create({
    baseURL: baseURL || undefined,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (config.skipAuth) {
      return config;
    }
    const token = await getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<unknown>) => {
      const status = error.response?.status;
      if (status === 401 && !error.config?.skipAuth) {
        invokeUnauthorized();
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

let apiInstancePromise: Promise<AxiosInstance> | null = null;

export async function getApi(): Promise<AxiosInstance> {
  if (!apiInstancePromise) {
    apiInstancePromise = bootstrapApiRuntime();
  }
  return apiInstancePromise;
}

export function parseAxiosApiError(error: unknown): NormalizedApiError | null {
  if (!axios.isAxiosError(error)) return null;
  const parsed = normalizeApiPayload(error.response?.data);
  if (!parsed && error.response?.status) {
    return {
      statusCode: error.response.status,
      message: formatNetworkErrorFallback(error),
    };
  }
  return parsed ?? { message: formatNetworkErrorFallback(error) };
}
