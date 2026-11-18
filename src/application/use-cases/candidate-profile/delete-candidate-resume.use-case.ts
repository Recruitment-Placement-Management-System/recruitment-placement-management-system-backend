import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateResumeUseCase {
  constructor(
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async execute(userId: string) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.resume) {
      throw new AppError(HttpStatus.NOT_FOUND, "Resume not found", "CANDIDATE_RESUME_NOT_FOUND");
    }

    const storageKey = profile.resume.storageKey;
    profile.resume = null;
    const updatedProfile = await this.candidateProfileRepository.update(profile);
    await this.fileStorage.delete(storageKey);
    return updatedProfile;
  }
}
