import type { Job } from "../../../domain/entities/job.entity.js";
import type { JobQueryOptions } from "../../dto/jobs/job.dto.js";
import type { IRepository } from "./repository.js";

export interface JobPage {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IJobRepository extends IRepository<Job> {
  findById(id: string): Promise<Job | null>;
  findByIds(ids: string[]): Promise<Job[]>;
  findByIdForRecruiter(id: string, recruiterId: string): Promise<Job | null>;
  findForRecruiter(recruiterId: string, options: JobQueryOptions): Promise<JobPage>;
  findPublished(options: JobQueryOptions): Promise<JobPage>;
  findRelated(jobId: string, limit: number): Promise<Job[]>;
  deleteByIdForRecruiter(id: string, recruiterId: string): Promise<boolean>;
}