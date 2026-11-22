import { AppError } from "../../errors/app-error.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetRecruiterJobDetailsUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobId: string, recruiterId: string) {
    const job = await this.jobRepository.findByIdForRecruiter(jobId, recruiterId);
    if (!job) throw new AppError(HttpStatus.NOT_FOUND, "Job not found", "JOB_NOT_FOUND");
    return job;
  }
}