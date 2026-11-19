import type { DeleteCandidateEducationDto } from "../../dto/candidate-profile/candidate-education.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateEducationUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: DeleteCandidateEducationDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.education[input.index]) {
      throw new AppError(HttpStatus.NOT_FOUND, "Education record not found", "EDUCATION_NOT_FOUND");
    }

    profile.education = profile.education.filter((_education, index) => index !== input.index);
    return this.candidateProfileRepository.update(profile);
  }
}
