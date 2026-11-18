export type CandidateEmploymentTypeDto = "full_time" | "part_time" | "contract" | "internship" | "temporary" | "freelance";
export type CandidateWorkModeDto = "remote" | "hybrid" | "onsite";
export type CandidateExperienceLevelDto = "internship" | "entry" | "junior" | "mid" | "senior" | "lead" | "executive";

export interface UpdateCandidateJobPreferencesDto {
  preferredRoles?: string[];
  preferredLocations?: string[];
  employmentTypes?: CandidateEmploymentTypeDto[];
  workModes?: CandidateWorkModeDto[];
  expectedSalary?: {
    minimum?: number | null;
    maximum?: number | null;
    currency?: string | null;
  } | null;
  experienceLevel?: CandidateExperienceLevelDto | null;
  noticePeriodDays?: number | null;
}

export interface CandidateJobPreferencesResponseDto {
  preferredRoles: string[];
  preferredLocations: string[];
  employmentTypes: CandidateEmploymentTypeDto[];
  workModes: CandidateWorkModeDto[];
  expectedSalary: {
    minimum: number | null;
    maximum: number | null;
    currency: string | null;
  } | null;
  experienceLevel: CandidateExperienceLevelDto | null;
  noticePeriodDays: number | null;
}
