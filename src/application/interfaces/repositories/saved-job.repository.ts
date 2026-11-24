import type { SavedJob } from "../../../domain/entities/saved-job.entity.js";

export interface ISavedJobRepository {
  save(userId: string, jobId: string): Promise<SavedJob>;
  findByUserId(userId: string): Promise<SavedJob[]>;
  deleteByUserAndJobId(userId: string, jobId: string): Promise<void>;
}
