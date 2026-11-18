import type { CreateCandidateProfileDto } from "../../dto/candidate-profile/candidate-profile.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { CandidateProfile } from "../../../domain/entities/candidate-profile.entity.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class CreateCandidateProfileUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: CreateCandidateProfileDto): Promise<CandidateProfile> {
    const existingProfile = await this.candidateProfileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError(HttpStatus.CONFLICT, "Candidate profile already exists", "CANDIDATE_PROFILE_EXISTS");
    }

    return this.candidateProfileRepository.create(new CandidateProfile(
      undefined,
      userId,
      input.fullName ?? "",
      input.profilePhoto ?? "",
      input.headline ?? "",
      input.bio ?? "",
      input.location ?? {},
      input.personalInfo ?? {},
      input.contactLinks ?? {},
      input.skills ?? [],
      input.education ?? [],
      input.experience ?? [],
      input.projects ?? [],
      input.certifications ?? [],
      input.languages ?? [],
      null,
      input.jobPreferences ?? {},
      "pending",
    ));
  }
}
