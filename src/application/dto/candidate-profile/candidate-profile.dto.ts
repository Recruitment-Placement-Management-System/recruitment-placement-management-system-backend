import type {
  CandidateProfile,
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
  skills?: CandidateProfileItem[];
  education?: CandidateProfileJson[];
  experience?: CandidateProfileJson[];
  projects?: CandidateProfileJson[];
  certifications?: CandidateProfileJson[];
  languages?: CandidateProfileItem[];
  resume?: CandidateProfileJson;
  jobPreferences?: CandidateProfileJson; 
}

export type UpdateCandidateProfileDto = Partial<CreateCandidateProfileDto>;

export type CandidateProfileResponseDto = Omit<CandidateProfile, "id"> & {
  _id: string;
};