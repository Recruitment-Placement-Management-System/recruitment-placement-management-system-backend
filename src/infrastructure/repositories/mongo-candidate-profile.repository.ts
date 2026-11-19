import type { ICandidateProfileRepository } from "../../application/interfaces/repositories/candidate-profile.repository.js";
import type { CandidateProfile } from "../../domain/entities/candidate-profile.entity.js";
import { CandidateProfileModel } from "../database/models/candidate-profile.model.js";
import { CandidateProfileMapper } from "../mappers/candidate-profile.mapper.js";
import { MongoBaseRepository } from "./mongo-base.repository.js";

export class MongoCandidateProfileRepository
  extends MongoBaseRepository<
    CandidateProfile,
    import("../database/models/candidate-profile.model.js").CandidateProfileDocument,
    ReturnType<typeof CandidateProfileMapper.toPersistence>
  >
  implements ICandidateProfileRepository
{
  constructor() {
    super(
      CandidateProfileModel,
      CandidateProfileMapper.toDomain,
      CandidateProfileMapper.toPersistence,
      (profile) => ({ $set: CandidateProfileMapper.toPersistence(profile) }),
      "Candidate profile not found",
    );
  }

  async findByUserId(userId: string): Promise<CandidateProfile | null> {
    const profile = await CandidateProfileModel.findOne({ userId }).exec();
    return profile ? CandidateProfileMapper.toDomain(profile) : null;
  }
}
