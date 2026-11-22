export type JobStatus = "draft" | "published";
export type JobEmploymentType = "full_time" | "part_time" | "contract" | "internship" | "temporary" | "freelance";
export type JobWorkMode = "remote" | "hybrid" | "onsite";
export type JobExperienceLevel = "internship" | "entry" | "junior" | "mid" | "senior" | "lead" | "executive";

export interface JobSalaryRange {
  minimum: number | null;
  maximum: number | null;
  currency: string;
}

export class Job {
  constructor(
    public readonly id: string | undefined,
    public readonly recruiterId: string,
    public readonly companyId: string,
    public readonly companyName: string,
    public title: string,
    public description: string,
    public responsibilities: string[],
    public requirements: string[],
    public skills: string[],
    public location: string,
    public employmentType: JobEmploymentType,
    public workMode: JobWorkMode,
    public experienceLevel: JobExperienceLevel,
    public salaryRange: JobSalaryRange | null,
    public openings: number,
    public applicationDeadline: Date | null,
    public status: JobStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
