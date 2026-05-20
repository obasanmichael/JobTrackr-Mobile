import { matchedJobsFromApi } from '../matched-jobs-mappers';

describe('matchedJobsFromApi', () => {
  it('maps API payload to ranked matched job rows', () => {
    const out = matchedJobsFromApi({
      matches: [
        {
          overallScore: 82,
          matchReason: 'Strong skill overlap in React + Node',
          matchedSkills: ['React', 'Node'],
          missingSkills: ['Kubernetes'],
          titleScore: 90,
          skillScore: 85,
          experienceScore: 70,
          locationScore: 80,
          recencyScore: 60,
          job: {
            id: 'job-1',
            title: 'Senior Engineer',
            companyName: 'Acme',
            location: 'Remote',
            workMode: 'REMOTE',
            applyUrl: 'https://jobs.example/posting',
            source: 'GREENHOUSE',
            postedAt: '2026-03-02T13:45:23.000Z',
            excerpt: 'Build APIs…',
          },
        },
      ],
      total: 1,
      requiresProfile: false,
      generatedAt: '2026-05-20T10:00:00.000Z',
    });

    expect(out.requiresProfile).toBe(false);
    expect(out.total).toBe(1);
    expect(out.generatedAt).toBe('2026-05-20T10:00:00.000Z');
    expect(out.matches).toHaveLength(1);
    expect(out.matches[0]?.overallScore).toBe(82);
    expect(out.matches[0]?.matchReason).toContain('React');
    expect(out.matches[0]?.matchedSkills).toEqual(['React', 'Node']);
    expect(out.matches[0]?.job.title).toBe('Senior Engineer');
  });

  it('passes through requiresProfile when user has no candidate profile', () => {
    const out = matchedJobsFromApi({
      matches: [],
      total: 0,
      requiresProfile: true,
    });

    expect(out.requiresProfile).toBe(true);
    expect(out.matches).toEqual([]);
  });
});
