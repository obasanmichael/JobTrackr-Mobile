import { jobSourceSubmissionSchema } from '../job-source-submission.schemas';

describe('jobSourceSubmissionSchema', () => {
  it('accepts a valid careers page submission', () => {
    const result = jobSourceSubmissionSchema.safeParse({
      companyName: 'Acme',
      careersUrl: 'https://boards.greenhouse.io/acme',
      submitterEmail: 'ops@acme.com',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid URLs', () => {
    const result = jobSourceSubmissionSchema.safeParse({
      companyName: 'Acme',
      careersUrl: 'not-a-url',
    });

    expect(result.success).toBe(false);
  });
});
