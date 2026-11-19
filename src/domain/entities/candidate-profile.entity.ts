export type CandidateVerificationStatus = "pending" | "verified" | "rejected";

export type CandidateProfileJson = Record<string, unknown>;
export type CandidateProfileItem = string | CandidateProfileJson;
export type CandidateResumeParsingStatus = "pending" | "processing" | "completed" | "failed";

export interface CandidateResume {
  storageKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  parsingStatus: CandidateResumeParsingStatus;
}

export type CandidateEmploymentType = "full_time" | "part_time" | "contract" | "internship" | "temporary" | "freelance";
export type CandidateWorkMode = "remote" | "hybrid" | "onsite";
export type CandidateExperienceLevel = "internship" | "entry" | "junior" | "mid" | "senior" | "lead" | "executive";

export interface CandidateExpectedSalary {
  minimum: number | null;
  maximum: number | null;
  currency: string | null;
}

export interface CandidateJobPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  employmentTypes: CandidateEmploymentType[];
  workModes: CandidateWorkMode[];
  expectedSalary: CandidateExpectedSalary | null;
  experienceLevel: CandidateExperienceLevel | null;
  noticePeriodDays: number | null;
}

export const createEmptyCandidateJobPreferences = (): CandidateJobPreferences => ({
  preferredRoles: [],
  preferredLocations: [],
  employmentTypes: [],
  workModes: [],
  expectedSalary: null,
  experienceLevel: null,
  noticePeriodDays: null,
});

export interface CandidateEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface CandidateExperience {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface CandidateProject {
  title: string;
  description?: string;
  technologies: string[];
  projectUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface CandidateCertification {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CandidateLanguage {
  name: string;
  proficiency: string;
}

export class CandidateProfile {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public fullName: string,
    public profilePhoto: string,
    public headline: string,
    public bio: string,
    public location: CandidateProfileJson,
    public personalInfo: CandidateProfileJson,
    public contactLinks: CandidateProfileJson,
    public skills: CandidateProfileItem[],
    public education: CandidateEducation[],
    public experience: CandidateExperience[],
    public projects: CandidateProject[],
    public certifications: CandidateCertification[],
    public languages: CandidateLanguage[],
    public resume: CandidateResume | null,
    public jobPreferences: CandidateJobPreferences,
    public verificationStatus: CandidateVerificationStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
