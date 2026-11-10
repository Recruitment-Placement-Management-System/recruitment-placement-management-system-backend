import type { CandidateProfile } from "../../../domain/entities/candidate-profile.entity.js";
import type { IRepository } from "./repository.js";

export interface ICandidateProfileRepository extends IRepository<CandidateProfile> {
  findByUserId(userId: string): Promise<CandidateProfile | null>;
}
