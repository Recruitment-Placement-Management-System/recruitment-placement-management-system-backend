import type { UpdateCandidateEducationDto } from "../../dto/candidate-profile/candidate-education.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidateEducationUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateEducationDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const existingEducation = profile.education[input.index];
    if (!existingEducation) {
      throw new AppError(HttpStatus.NOT_FOUND, "Education record not found", "EDUCATION_NOT_FOUND");
    }

    const { index, ...updates } = input;
    profile.education = profile.education.map((education, educationIndex) =>
      educationIndex === index ? { ...education, ...updates } : education,
    );
    return this.candidateProfileRepository.update(profile);
  }
}