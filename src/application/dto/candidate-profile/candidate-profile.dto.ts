import type {
  CandidateEducation,
  CandidateExperience,
  CandidateProject,
  CandidateCertification,
  CandidateLanguage,
  CandidateProfileJson,
} from "../../../domain/entities/candidate-profile.entity.js";
import type { CandidateJobPreferencesResponseDto } from "./candidate-job-preferences.dto.js";

export interface CreateCandidateProfileDto {
  fullName?: string;
  profilePhoto?: string;
  headline?: string;
  bio?: string;
  location?: CandidateProfileJson;
  personalInfo?: CandidateProfileJson;
  contactLinks?: CandidateProfileJson;
  skills?: string[];
  education?: CandidateEducation[];
  experience?: CandidateExperience[];
  projects?: CandidateProject[];
  certifications?: CandidateCertification[];
  languages?: CandidateLanguage[];
}

export type UpdateCandidateProfileDto = Partial<CreateCandidateProfileDto>;

export interface UpdateCandidatePersonalInformationDto {
  personalInfo?: {
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    maritalStatus?: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contactLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface CandidateProfileResponseDto {
  _id: string;
  userId: string;
  fullName: string;
  profilePhoto: string;
  headline: string;
  bio: string;
  location: Record<string, unknown>;
  personalInfo: Record<string, unknown>;
  contactLinks: Record<string, unknown>;
  skills: Array<string | Record<string, unknown>>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
  }>;
  experience: Array<{
    companyName: string;
    jobTitle: string;
    employmentType?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
  }>;
  projects: Array<{
    title: string;
    description?: string;
    technologies: string[];
    projectUrl?: string;
    repositoryUrl?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  languages: Array<{ name: string; proficiency: string }>;
  resume: CandidateResumeResponseDto | null;
  jobPreferences: CandidateJobPreferencesResponseDto;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CandidateResumeResponseDto {
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  parsingStatus: "pending" | "processing" | "completed" | "failed";
  downloadUrl: string;
}
