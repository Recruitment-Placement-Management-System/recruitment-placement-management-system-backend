import type { IRecruiterProfileRepository } from "../../application/interfaces/repositories/recruiter-profile.repository.js";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity.js";
import { RecruiterProfileModel } from "../database/models/recruiter-profile.model.js";
import { RecruiterProfileMapper } from "../mappers/recruiter-profile.mapper.js";

export class MongoRecruiterProfileRepository implements IRecruiterProfileRepository{
  async findByUserId(userId: string): Promise<RecruiterProfile | null> {
    const profile = await RecruiterProfileModel.findOne({
      userId,   
    }).exec()

    if(!profile)return null;

    return RecruiterProfileMapper.toDomain(profile)
  }

  async create(profile: RecruiterProfile): Promise<RecruiterProfile> {
    const createdProfile = await RecruiterProfileModel.create(RecruiterProfileMapper.toPersistence(profile))

    return RecruiterProfileMapper.toDomain(createdProfile)
  }

  async update(profile: RecruiterProfile): Promise<RecruiterProfile> {
    const updatedProfile = await RecruiterProfileModel.findByIdAndUpdate(
      profile.id,
      {
        $set:{
          ...RecruiterProfileMapper.toPersistence(profile),
        }
      },
      {
        new :true,
        runValidators:true,
      }
    ).exec();

    if(!updatedProfile){
      throw new Error('Recruiter profile not found')
    }
    return RecruiterProfileMapper.toDomain(updatedProfile)
  }
}
