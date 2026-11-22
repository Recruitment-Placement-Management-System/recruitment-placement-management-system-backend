import type { ISavedJobRepository } from "../../application/interfaces/repositories/saved-job.repository.js";
import { SavedJob } from "../../domain/entities/saved-job.entity.js";
import { SavedJobModel, type SavedJobDocument } from "../database/models/saved-job.model.js";

const toDomain = (document: SavedJobDocument) => new SavedJob(
  String(document._id),
  String(document.userId),
  String(document.jobId),
  document.createdAt,
);

export class MongoSavedJobRepository implements ISavedJobRepository {
  async save(userId: string, jobId: string): Promise<SavedJob> {
    const document = await SavedJobModel.findOneAndUpdate(
      { userId, jobId },
      { $setOnInsert: { userId, jobId } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return toDomain(document);
  }

  async findByUserId(userId: string): Promise<SavedJob[]> {
    const documents = await SavedJobModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return documents.map(toDomain);
  }

  async deleteByUserAndJobId(userId: string, jobId: string): Promise<void> {
    await SavedJobModel.deleteOne({ userId, jobId }).exec();
  }
}
