import type {
  CandidateProfile,
  CandidateEducation,
  CandidateProfileItem,
  CandidateProfileJson,
} from "../../../domain/entities/candidate-profile.entity.js";

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
  experience?: CandidateProfileJson[];
  projects?: CandidateProfileJson[];
  certifications?: CandidateProfileJson[];
  languages?: CandidateProfileItem[];
  resume?: CandidateProfileJson;
  jobPreferences?: CandidateProfileJson; 
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

export type CandidateProfileResponseDto = Omit<CandidateProfile, "id"> & {
  _id: string;
};
