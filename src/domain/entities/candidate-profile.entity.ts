export type CandidateVerificationStatus = "pending" | "verified" | "rejected";

export type CandidateProfileJson = Record<string, unknown>;
export type CandidateProfileItem = string | CandidateProfileJson;

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
    public languages: CandidateProfileItem[],
    public resume: CandidateProfileJson,
    public jobPreferences: CandidateProfileJson,
    public verificationStatus: CandidateVerificationStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
