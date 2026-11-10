import type { UpdateCandidateExperienceDto } from "../../dto/candidate-profile/candidate-experience.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidateExperienceUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateExperienceDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const existingExperience = profile.experience[input.index];
    if (!existingExperience) {
      throw new AppError(HttpStatus.NOT_FOUND, "Experience record not found", "EXPERIENCE_NOT_FOUND");
    }

    const { index, ...updates } = input;
    const updatedExperience = { ...existingExperience, ...updates };
    if (updates.isCurrent === true) {
      updatedExperience.endDate = "";
    } else if (updates.endDate) {
      updatedExperience.isCurrent = false;
    }

    if (!updatedExperience.isCurrent && !updatedExperience.endDate) {
      throw new AppError(HttpStatus.BAD_REQUEST, "End date is required for past employment", "EXPERIENCE_END_DATE_REQUIRED");
    }
    if (updatedExperience.endDate && updatedExperience.endDate < updatedExperience.startDate) {
      throw new AppError(HttpStatus.BAD_REQUEST, "End date must be on or after start date", "INVALID_EXPERIENCE_DATE_RANGE");
    }

    profile.experience = profile.experience.map((experience, experienceIndex) =>
      experienceIndex === index ? updatedExperience : experience,
    );
    return this.candidateProfileRepository.update(profile);
  }
}
