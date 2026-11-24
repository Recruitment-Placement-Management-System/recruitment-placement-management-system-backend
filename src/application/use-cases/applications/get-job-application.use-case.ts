import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";
import type { GetJobApplicationRole } from "../../dto/applications/job-application.dto.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetJobApplicationUseCase {
  constructor(private readonly applications: IJobApplicationRepository) {}
  async execute(applicationId: string, userId: string, role: GetJobApplicationRole) {
    const application = await this.applications.findById(applicationId);
    if (!application || (role === "candidate" ? application.candidateId !== userId : application.recruiterId !== userId)) throw new AppError(HttpStatus.NOT_FOUND, "Application not found", "APPLICATION_NOT_FOUND");
    return application;
  }
}
