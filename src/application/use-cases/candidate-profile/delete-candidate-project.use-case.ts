import type { DeleteCandidateProjectDto } from "../../dto/candidate-profile/candidate-project.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateProjectUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: DeleteCandidateProjectDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.projects[input.index]) {
      throw new AppError(HttpStatus.NOT_FOUND, "Project not found", "PROJECT_NOT_FOUND");
    }

    profile.projects = profile.projects.filter((_project, index) => index !== input.index);
    return this.candidateProfileRepository.update(profile);
  }
}
