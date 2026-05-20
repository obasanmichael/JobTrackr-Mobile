import { z } from 'zod';

export const jobSourceSubmissionSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required').max(200),
  careersUrl: z.string().trim().url('Enter a valid careers page URL').max(2048),
  submitterEmail: z
    .union([z.string().trim().email('Enter a valid email address'), z.literal('')])
    .optional(),
});

export type JobSourceSubmissionFormValues = z.infer<typeof jobSourceSubmissionSchema>;
