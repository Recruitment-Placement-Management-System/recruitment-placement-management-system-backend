import { AppError } from "../../errors/app-error.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetJobDetailsUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobId: string) {
    const job = await this.jobRepository.findById(jobId);
    if (!job || job.status !== "published" || (job.applicationDeadline && job.applicationDeadline.getTime() < Date.now())) {
      throw new AppError(HttpStatus.NOT_FOUND, "Job not found", "JOB_NOT_FOUND");
    }
    return job;
  }
}
