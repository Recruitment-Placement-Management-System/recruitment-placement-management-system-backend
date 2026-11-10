import type { DeleteCandidateExperienceDto } from "../../dto/candidate-profile/candidate-experience.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateExperienceUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: DeleteCandidateExperienceDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.experience[input.index]) {
      throw new AppError(HttpStatus.NOT_FOUND, "Experience record not found", "EXPERIENCE_NOT_FOUND");
    }

    profile.experience = profile.experience.filter((_experience, index) => index !== input.index);
    return this.candidateProfileRepository.update(profile);
  }
}
