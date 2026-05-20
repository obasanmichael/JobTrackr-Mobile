import { jobDetailToCreateApplicationPayload } from '../job-to-application';
import type { JobBoardDetail } from '../../types/job-board.dto';

describe('jobDetailToCreateApplicationPayload', () => {
  it('maps external job detail into a SAVED application draft', () => {
    const job: JobBoardDetail = {
      id: 'job-1',
      title: 'Backend Engineer',
      companyName: 'Acme',
      location: 'London',
      workMode: 'REMOTE',
      applyUrl: 'https://jobs.example/acme/1',
      salaryMin: 100000,
      salaryMax: 120000,
      currency: 'USD',
      source: 'Demo Greenhouse',
      sourceMeta: { name: 'Demo Greenhouse', type: 'ATS_FEED' },
      postedAt: '2026-05-01T00:00:00.000Z',
      description: 'Build APIs',
      requirements: null,
      experienceLevel: 'SENIOR',
      employmentType: 'FULL_TIME',
      country: 'UK',
    };

    const payload = jobDetailToCreateApplicationPayload(job);

    expect(payload.jobTitle).toBe('Backend Engineer');
    expect(payload.companyName).toBe('Acme');
    expect(payload.status).toBe('SAVED');
    expect(payload.workMode).toBe('REMOTE');
    expect(payload.notes).toContain('Demo Greenhouse');
  });
});
