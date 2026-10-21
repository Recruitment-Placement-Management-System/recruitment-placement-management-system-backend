import type { IRecruiterProfileRepository } from "../../application/interfaces/repositories/recruiter-profile.repository.js";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity.js";
import { RecruiterProfileModel } from "../database/models/recruiter-profile.model.js";
import { RecruiterProfileMapper } from "../mappers/recruiter-profile.mapper.js";
import { MongoBaseRepository } from "./mongo-base.repository.js";

export class MongoRecruiterProfileRepository extends MongoBaseRepository<RecruiterProfile, import("../database/models/recruiter-profile.model.js").RecruiterProfileDocument, ReturnType<typeof RecruiterProfileMapper.toPersistence>> implements IRecruiterProfileRepository {
  constructor() {
    super(RecruiterProfileModel, RecruiterProfileMapper.toDomain, RecruiterProfileMapper.toPersistence, (profile) => ({ $set: RecruiterProfileMapper.toPersistence(profile) }), "Recruiter profile not found");
  }

  async findByUserId(userId: string): Promise<RecruiterProfile | null> {
    const profile = await RecruiterProfileModel.findOne({
      userId,   
    }).exec()

    if(!profile)return null;

    return RecruiterProfileMapper.toDomain(profile)
  }

}
