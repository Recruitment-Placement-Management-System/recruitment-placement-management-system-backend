import type { RemoveCandidateLanguageDto } from "../../dto/candidate-profile/candidate-language.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class RemoveCandidateLanguageUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: RemoveCandidateLanguageDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.languages[input.index]) {
      throw new AppError(HttpStatus.NOT_FOUND, "Language not found", "LANGUAGE_NOT_FOUND");
    }

    profile.languages = profile.languages.filter((_language, index) => index !== input.index);
    return this.candidateProfileRepository.update(profile);
  }
}
