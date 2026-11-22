import type { ISavedJobRepository } from "../../interfaces/repositories/saved-job.repository.js";

export class RemoveCandidateSavedJobUseCase {
  constructor(private readonly savedJobRepository: ISavedJobRepository) {}

  execute(userId: string, jobId: string): Promise<void> {
    return this.savedJobRepository.deleteByUserAndJobId(userId, jobId);
  }
}
