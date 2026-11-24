import type { JobApplicationQueryDto } from "../../dto/applications/job-application.dto.js";
import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";

export class ListRecruiterApplicationsUseCase {
  constructor(private readonly applications: IJobApplicationRepository) {}
  execute(recruiterId: string, options: JobApplicationQueryDto) { return this.applications.findForRecruiter(recruiterId, options); }
}
