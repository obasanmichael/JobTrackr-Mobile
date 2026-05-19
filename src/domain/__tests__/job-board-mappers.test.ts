import { jobSearchFromApi } from '../job-board-mappers';

describe('jobSearchFromApi', () => {
  it('maps API payload to normalized job search rows', () => {
    const out = jobSearchFromApi({
      jobs: [
        {
          id: '1',
          title: 'Engineer',
          companyName: 'Acme',
          location: 'NYC',
          workMode: 'REMOTE',
          applyUrl: 'https://jobs.example/posting',
          salaryMin: 100_000,
          salaryMax: 130_000,
          currency: 'USD',
          source: 'TEST',
          postedAt: '2026-03-02T13:45:23.000Z',
          excerpt: 'Help us ship…',
        },
      ],
      total: 42,
      page: 1,
      limit: 20,
    });

    expect(out.total).toBe(42);
    expect(out.limit).toBe(20);
    expect(out.page).toBe(1);
    expect(out.jobs).toHaveLength(1);
    expect(out.jobs[0]?.title).toBe('Engineer');
    expect(out.jobs[0]?.applyUrl).toContain('jobs.example');
  });
});
