import { AppError } from "../../errors/app-error.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteJobUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobId: string, recruiterId: string): Promise<void> {
    const deleted = await this.jobRepository.deleteByIdForRecruiter(jobId, recruiterId);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, "Job not found", "JOB_NOT_FOUND");
  }
}
