type ApiErrorPayload = {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
  details?: string[];
};

/**
 * Normalized client error aligned with Nest `HttpExceptionFilter` JSON body.
 */
export type NormalizedApiError = {
  statusCode?: number;
  message: string;
  details?: string[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function normalizeApiPayload(data: unknown): NormalizedApiError | null {
  if (!isRecord(data)) return null;
  if (typeof data.statusCode !== 'number') return null;
  const raw = data.message;
  const messageArr = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : [];
  const message = messageArr.length ? messageArr.join('\n') : 'Request failed';
  const details = Array.isArray(data.details)
    ? data.details.filter((d): d is string => typeof d === 'string')
    : typeof raw === 'string'
      ? undefined
      : Array.isArray(raw)
        ? raw
        : undefined;
  const payload = data as unknown as ApiErrorPayload;
  return {
    statusCode: payload.statusCode,
    message,
    details,
  };
}

export function formatNetworkErrorFallback(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Network error. Check EXPO_PUBLIC_API_URL and connectivity.';
}
