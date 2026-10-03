import type { IRecruiterProfileRepository } from "../../application/interfaces/repositories/recruiter-profile.repository.js";
import  { RecruiterProfile,RecruiterVerificationStatus } from "../../domain/entities/recruiter-profile.entity.js";
import { RecruiterProfileModel } from "../database/models/recruiter-profile.model.js";

export class MongoRecruiterProfileRepository implements IRecruiterProfileRepository{
  private toDomain(document:{
    _id:unknown;
    userId:unknown;
    companyId:unknown;
    fullName:string;
    designation:string;
    verificationStatus:RecruiterVerificationStatus;
    createdAt:Date;
    updatedAt:Date;
  }):RecruiterProfile{
    return new RecruiterProfile(
      String(document._id),
      String(document.userId),
      String(document.companyId),
      document.fullName,
      document.designation,
      document.verificationStatus,
      document.createdAt,
      document.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<RecruiterProfile | null> {
    const profile = await RecruiterProfileModel.findOne({
      userId,   
    }).exec()

    if(!profile)return null;

    return this.toDomain(profile)
  }

  async create(profile: RecruiterProfile): Promise<RecruiterProfile> {
    const createdProfile = await RecruiterProfileModel.create({
      userId:profile.userId,
      companyId:profile.companyId,
      fullName:profile.fullName,
      designation:profile.designation,
      verificationStatus:profile.verificationStatus,
    })

    return this.toDomain(createdProfile)
  }

  async update(profile: RecruiterProfile): Promise<RecruiterProfile> {
    const updatedProfile = await RecruiterProfileModel.findByIdAndUpdate(
      profile.id,
      {
        $set:{
          userId:profile.userId,
          companyId:profile.companyId,
          fullName:profile.fullName,
          designation:profile.designation,
          verificationStatus:profile.verificationStatus, 
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
    return this.toDomain(updatedProfile)
  }
}