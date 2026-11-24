import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";
import type { UpdateJobApplicationStatusDto } from "../../dto/applications/job-application.dto.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateApplicationStatusUseCase {
  constructor(private readonly applications: IJobApplicationRepository) {}
  async execute(applicationId: string, recruiterId: string, status: UpdateJobApplicationStatusDto) {
    const application = await this.applications.findById(applicationId);
    if (!application || application.recruiterId !== recruiterId) throw new AppError(HttpStatus.NOT_FOUND, "Application not found", "APPLICATION_NOT_FOUND");
    if (application.status === "withdrawn") throw new AppError(HttpStatus.CONFLICT, "Withdrawn applications cannot be changed", "APPLICATION_WITHDRAWN");
    if (application.status === "rejected" && status !== "rejected") throw new AppError(HttpStatus.CONFLICT, "Rejected applications cannot be reopened", "APPLICATION_ALREADY_REJECTED");
    const updated = await this.applications.updateStatus(applicationId, status);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Application not found", "APPLICATION_NOT_FOUND");
    return updated;
  }
}
