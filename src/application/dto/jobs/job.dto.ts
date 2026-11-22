import type { JobEmploymentType, JobExperienceLevel, JobSalaryRange, JobStatus, JobWorkMode } from "../../../domain/entities/job.entity.js";

export interface CreateJobDto {
  title: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  location: string;
  employmentType: JobEmploymentType;
  workMode: JobWorkMode;
  experienceLevel: JobExperienceLevel;
  salaryRange?: JobSalaryRange | null;
  openings?: number;
  applicationDeadline?: string | null;
}

export type UpdateJobDto = Partial<CreateJobDto>;

export interface JobQueryOptions {
  page: number;
  limit: number;
  q?: string | undefined;
  location?: string | undefined;
  employmentType?: JobEmploymentType | undefined;
  workMode?: JobWorkMode | undefined;
  experienceLevel?: JobExperienceLevel | undefined;
  skill?: string | undefined;
  status?: JobStatus | undefined;
}

export interface JobResponseDto {
  _id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  employmentType: JobEmploymentType;
  workMode: JobWorkMode;
  experienceLevel: JobExperienceLevel;
  salaryRange: JobSalaryRange | null;
  openings: number;
  applicationDeadline: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}
