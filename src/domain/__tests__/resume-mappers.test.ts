import type { CandidateProfileApiRecord, ResumeApiRecord } from '../resume-mappers';
import { candidateProfileFromApi, resumeFromApi } from '../resume-mappers';

describe('resume mappers', () => {
  it('maps resumes from API payloads', () => {
    const raw: ResumeApiRecord = {
      id: 'r1',
      userId: 'u1',
      fileName: 'cv.pdf',
      fileType: 'application/pdf',
      fileSize: 2048,
      fileUrl: 'https://cdn.example/object',
      status: 'PARSED',
      parsedText: 'parsed',
      parseError: null,
      isActive: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
      storageKey: 'omit-me',
    };
    const ui = resumeFromApi(raw);
    expect(ui.id).toBe('r1');
    expect((ui as { storageKey?: string }).storageKey).toBeUndefined();
    expect(ui.isActive).toBe(true);
  });

  it('expands structured profile blobs into string lists like the web mapper', () => {
    const raw: CandidateProfileApiRecord = {
      id: 'p1',
      userId: 'u1',
      resumeId: 'r1',
      headline: 'Builder',
      summary: 'Hands-on engineer',
      skills: ['Rust', 'TypeScript'],
      tools: [{ name: 'Expo', level: 'pro' }] as unknown,
      roles: null,
      industries: ['SaaS'],
      yearsOfExperience: 10,
      locations: [],
      workModes: null,
      education: [['MS CS']],
      certifications: [['AWS']],
      projects: [['Side project']],
      experience: [['Acme']],
      isConfirmed: false,
      createdAt: '2026-01-02',
      updatedAt: '2026-01-03',
    };

    const profile = candidateProfileFromApi(raw);
    expect(profile.headline).toBe('Builder');
    expect(profile.skills).toEqual(['Rust', 'TypeScript']);
    expect(profile.roles).toEqual([]);
    expect(profile.tools.every((item) => item.length > 0)).toBe(true);
    expect(profile.educationLines.length).toBeGreaterThanOrEqual(1);
    expect(profile.isConfirmed).toBe(false);
  });
});
