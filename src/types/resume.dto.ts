export type ResumeParseStatus = 'UPLOADED' | 'PARSING' | 'PARSED' | 'FAILED' | 'ARCHIVED';

/** Resume row aligned with web `Resume` model. */
export interface ResumeDto {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string | null;
  status: ResumeParseStatus;
  parsedText?: string | null;
  parseError?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Normalized profile aligned with web `CandidateProfile` (arrays as string lists). */
export interface CandidateProfileDto {
  id: string;
  userId: string;
  resumeId: string;
  headline?: string | null;
  summary?: string | null;
  skills: string[];
  tools: string[];
  roles: string[];
  industries: string[];
  yearsOfExperience?: number | null;
  locations: string[];
  workModes: string[];
  educationLines: string[];
  certificationLines: string[];
  projectLines: string[];
  experienceLines: string[];
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}
