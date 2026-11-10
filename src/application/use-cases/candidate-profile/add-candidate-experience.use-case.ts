import type { AddCandidateExperienceDto } from "../../dto/candidate-profile/candidate-experience.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class AddCandidateExperienceUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: AddCandidateExperienceDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const experience = { ...input, ...(input.isCurrent ? { endDate: "" } : {}) };
    profile.experience = [...profile.experience, experience];
    return this.candidateProfileRepository.update(profile);
  }
}
