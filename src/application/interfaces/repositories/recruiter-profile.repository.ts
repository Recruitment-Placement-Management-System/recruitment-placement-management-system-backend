import type { RecruiterProfile } from "../../../domain/entities/recruiter-profile.entity.js";

export interface IRecruiterProfileRepository {
  findByUserId(userId: string): Promise<RecruiterProfile | null>;
  create(profile: RecruiterProfile): Promise<RecruiterProfile>;
  update(profile: RecruiterProfile): Promise<RecruiterProfile>;
}