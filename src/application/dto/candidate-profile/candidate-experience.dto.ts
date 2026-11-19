export interface AddCandidateExperienceDto {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface UpdateCandidateExperienceDto {
  index: number;
  companyName?: string;
  jobTitle?: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface DeleteCandidateExperienceDto {
  index: number;
}
