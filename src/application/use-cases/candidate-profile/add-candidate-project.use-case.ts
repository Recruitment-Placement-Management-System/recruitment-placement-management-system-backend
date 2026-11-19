import type { AddCandidateProjectDto } from "../../dto/candidate-profile/candidate-project.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class AddCandidateProjectUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: AddCandidateProjectDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const project = { ...input, technologies: input.technologies ?? [] };
    profile.projects = [...profile.projects, project];
    return this.candidateProfileRepository.update(profile);
  }
}
