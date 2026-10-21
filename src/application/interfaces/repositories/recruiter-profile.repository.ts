import type { RecruiterProfile } from "../../../domain/entities/recruiter-profile.entity.js";
import type { IRepository } from "./repository.js";

export interface IRecruiterProfileRepository extends IRepository<RecruiterProfile> {
  findByUserId(userId: string): Promise<RecruiterProfile | null>;
}
