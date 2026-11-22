import { AppError } from "../../errors/app-error.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class SetJobPublicationUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobId: string, recruiterId: string, publish: boolean) {
    const job = await this.jobRepository.findByIdForRecruiter(jobId, recruiterId);
    if (!job) throw new AppError(HttpStatus.NOT_FOUND, "Job not found", "JOB_NOT_FOUND");
    if (publish && job.applicationDeadline && job.applicationDeadline.getTime() < Date.now()) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Cannot publish a job with a past application deadline", "JOB_DEADLINE_PASSED");
    }
    job.status = publish ? "published" : "draft";
    return this.jobRepository.update(job);
  }
}
