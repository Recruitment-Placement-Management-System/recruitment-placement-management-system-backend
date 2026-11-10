import type { UpdateCandidatePersonalInformationDto } from "../../dto/candidate-profile/candidate-profile.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidatePersonalInformationUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidatePersonalInformationDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    if (input.personalInfo) {
      profile.personalInfo = { ...profile.personalInfo, ...input.personalInfo };
    }
    if (input.location) {
      profile.location = { ...profile.location, ...input.location };
    }
    if (input.contactLinks) {
      profile.contactLinks = { ...profile.contactLinks, ...input.contactLinks };
    }

    return this.candidateProfileRepository.update(profile);
  }
}
