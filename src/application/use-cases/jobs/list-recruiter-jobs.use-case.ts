import type { JobQueryOptions } from "../../dto/jobs/job.dto.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";

export class ListRecruiterJobsUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  execute(recruiterId: string, options: JobQueryOptions) {
    return this.jobRepository.findForRecruiter(recruiterId, options);
  }
}
