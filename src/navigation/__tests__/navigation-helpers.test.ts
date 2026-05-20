import { buildMoreStackState } from '../navigation-helpers';

describe('buildMoreStackState', () => {
  it('returns only MoreHub for hub navigation', () => {
    expect(buildMoreStackState('MoreHub')).toEqual([{ name: 'MoreHub' }]);
  });

  it('includes MoreHub below pushed More screens for working back navigation', () => {
    expect(buildMoreStackState('ResumeOverview')).toEqual([
      { name: 'MoreHub' },
      { name: 'ResumeOverview' },
    ]);
  });

  it('passes params to the target screen', () => {
    expect(
      buildMoreStackState('ResumeDetail', { resumeId: 'abc' }),
    ).toEqual([
      { name: 'MoreHub' },
      { name: 'ResumeDetail', params: { resumeId: 'abc' } },
    ]);
  });
});
