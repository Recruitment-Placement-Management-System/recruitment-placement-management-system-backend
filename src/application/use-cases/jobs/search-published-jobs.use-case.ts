import type { JobQueryOptions } from "../../dto/jobs/job.dto.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";

export class SearchPublishedJobsUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  execute(options: JobQueryOptions) {
    return this.jobRepository.findPublished(options);
  }
}
