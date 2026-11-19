import type { CandidateResume } from "../../../domain/entities/candidate-profile.entity.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetCandidateResumeUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string): Promise<CandidateResume> {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.resume) {
      throw new AppError(HttpStatus.NOT_FOUND, "Resume not found", "CANDIDATE_RESUME_NOT_FOUND");
    }
    return profile.resume;
  }
}
