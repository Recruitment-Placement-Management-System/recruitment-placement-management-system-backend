import type { ISavedJobRepository } from "../../interfaces/repositories/saved-job.repository.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class SaveCandidateJobUseCase {
  constructor(
    private readonly savedJobRepository: ISavedJobRepository,
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(userId: string, jobId: string) {
    const job = await this.jobRepository.findById(jobId);
    if (!job || job.status !== "published" || (job.applicationDeadline && job.applicationDeadline.getTime() < Date.now())) {
      throw new AppError(HttpStatus.NOT_FOUND, "Available job not found", "JOB_NOT_FOUND");
    }
    return this.savedJobRepository.save(userId, jobId);
  }
}
