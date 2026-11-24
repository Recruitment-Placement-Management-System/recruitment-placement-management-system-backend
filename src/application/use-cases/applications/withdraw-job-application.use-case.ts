import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class WithdrawJobApplicationUseCase {
  constructor(private readonly applications: IJobApplicationRepository) {}
  async execute(applicationId: string, candidateId: string) {
    const application = await this.applications.findById(applicationId);
    if (!application || application.candidateId !== candidateId) throw new AppError(HttpStatus.NOT_FOUND, "Application not found", "APPLICATION_NOT_FOUND");
    if (["rejected", "withdrawn"].includes(application.status)) throw new AppError(HttpStatus.CONFLICT, "This application cannot be withdrawn", "APPLICATION_CANNOT_BE_WITHDRAWN");
    const updated = await this.applications.updateStatus(applicationId, "withdrawn");
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Application not found", "APPLICATION_NOT_FOUND");
    return updated;
  }
}
