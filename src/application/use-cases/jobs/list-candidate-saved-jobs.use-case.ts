import type { ISavedJobRepository } from "../../interfaces/repositories/saved-job.repository.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";

export class ListCandidateSavedJobsUseCase {
  constructor(
    private readonly savedJobRepository: ISavedJobRepository,
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(userId: string) {
    const savedItems = await this.savedJobRepository.findByUserId(userId);
    const jobs = await this.jobRepository.findByIds(savedItems.map((saved) => saved.jobId));
    const jobsById = new Map(jobs.map((job) => [job.id, job]));
    return savedItems.flatMap((saved) => {
      const job = jobsById.get(saved.jobId);
      return job ? [{ job, savedAt: saved.createdAt }] : [];
    });
  }
}
