import type { UpdateCandidateProjectDto } from "../../dto/candidate-profile/candidate-project.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidateProjectUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateProjectDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const existingProject = profile.projects[input.index];
    if (!existingProject) {
      throw new AppError(HttpStatus.NOT_FOUND, "Project not found", "PROJECT_NOT_FOUND");
    }

    const { index, ...updates } = input;
    profile.projects = profile.projects.map((project, projectIndex) =>
      projectIndex === index ? { ...project, ...updates } : project,
    );
    return this.candidateProfileRepository.update(profile);
  }
}
