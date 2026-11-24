import type { JobApplicationQueryDto } from "../../dto/applications/job-application.dto.js";
import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";

export class ListCandidateApplicationsUseCase {
  constructor(private readonly applications: IJobApplicationRepository) {}
  execute(candidateId: string, options: JobApplicationQueryDto) {
     return this.applications.findForCandidate(candidateId, options); 
    }
}
