import type { CandidateProfileDto, ResumeDto, ResumeParseStatus } from '../types/resume.dto';

export interface ResumeApiRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string | null;
  storageKey?: string;
  status: ResumeParseStatus;
  parsedText: string | null;
  parseError: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function resumeFromApi(raw: ResumeApiRecord): ResumeDto {
  const { storageKey: _omit, ...rest } = raw;
  void _omit;
  return {
    ...rest,
    fileUrl: raw.fileUrl,
    parsedText: raw.parsedText,
    parseError: raw.parseError,
  };
}

export interface CandidateProfileApiRecord {
  id: string;
  userId: string;
  resumeId: string;
  headline: string | null;
  summary: string | null;
  skills: unknown;
  tools: unknown;
  roles: unknown;
  industries: unknown;
  yearsOfExperience: number | null;
  locations: unknown;
  workModes: unknown;
  education: unknown;
  certifications: unknown;
  projects: unknown;
  experience: unknown;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

function stringifyListEntries(value: unknown): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    if (typeof entry === 'string') return entry;
    if (typeof entry === 'number') return String(entry);
    try {
      return JSON.stringify(entry);
    } catch {
      return '';
    }
  });
}

function linesFromJsonArray(value: unknown): string[] {
  return stringifyListEntries(value);
}

export function candidateProfileFromApi(raw: CandidateProfileApiRecord): CandidateProfileDto {
  return {
    id: raw.id,
    userId: raw.userId,
    resumeId: raw.resumeId,
    headline: raw.headline,
    summary: raw.summary,
    skills: stringifyListEntries(raw.skills),
    tools: stringifyListEntries(raw.tools),
    roles: stringifyListEntries(raw.roles),
    industries: stringifyListEntries(raw.industries),
    yearsOfExperience: raw.yearsOfExperience,
    locations: stringifyListEntries(raw.locations),
    workModes: stringifyListEntries(raw.workModes),
    educationLines: linesFromJsonArray(raw.education),
    certificationLines: linesFromJsonArray(raw.certifications),
    projectLines: linesFromJsonArray(raw.projects),
    experienceLines: linesFromJsonArray(raw.experience),
    isConfirmed: raw.isConfirmed,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
