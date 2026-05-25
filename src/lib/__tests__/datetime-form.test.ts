import { combineDateAndTimeToIso, formatIsoForDisplay } from '../datetime-form';

describe('datetime-form', () => {
  it('combines date and time to iso', () => {
    const iso = combineDateAndTimeToIso('2026-05-20', '14:30');
    expect(iso).toContain('2026-05-20');
    expect(new Date(iso).toString()).not.toBe('Invalid Date');
  });

  it('formats iso for display', () => {
    const label = formatIsoForDisplay('2026-05-20T14:30:00.000Z');
    expect(label).toMatch(/May 20, 2026/);
  });
});
