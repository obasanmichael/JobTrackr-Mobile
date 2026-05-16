import { normalizeApiPayload, formatNetworkErrorFallback } from '../api-error';

describe('api-error', () => {
  it('formats known Nest validation payload into a readable message', () => {
    const payload = normalizeApiPayload({
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    });
    expect(payload?.statusCode).toBe(400);
    expect(payload?.message).toContain('must be');
  });

  it('returns null when body is unexpected', () => {
    expect(normalizeApiPayload(undefined)).toBeNull();
    expect(normalizeApiPayload({ foo: 1 })).toBeNull();
  });

  it('fallback uses Error.message when present', () => {
    expect(formatNetworkErrorFallback(new Error('Offline'))).toBe('Offline');
  });
});
