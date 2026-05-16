import { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { parseAxiosApiError } from '../api';

function minimalConfig(): InternalAxiosRequestConfig {
  return { headers: {} } as InternalAxiosRequestConfig;
}

describe('parseAxiosApiError', () => {
  it('parses Nest-style JSON envelopes on Axios failures', () => {
    const err = new AxiosError('Unauthorized');
    err.response = {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: minimalConfig(),
      data: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    };

    const normalized = parseAxiosApiError(err);
    expect(normalized?.statusCode).toBe(401);
    expect(normalized?.message).toContain('Unauthorized');
  });

  it('returns null for non-Axios errors', () => {
    expect(parseAxiosApiError(new Error('plain'))).toBeNull();
  });
});
