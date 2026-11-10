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
    public experience: CandidateProfileItem[],
    public projects: CandidateProfileItem[],
    public certifications: CandidateProfileItem[],
    public languages: CandidateProfileItem[],
    public resume: CandidateProfileJson,
    public jobPreferences: CandidateProfileJson,
    public verificationStatus: CandidateVerificationStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
