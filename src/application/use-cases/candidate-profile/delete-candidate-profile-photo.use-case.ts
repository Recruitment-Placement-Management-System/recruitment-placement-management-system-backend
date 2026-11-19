import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateProfilePhotoUseCase {
  constructor(
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async execute(userId: string) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.profilePhoto) {
      throw new AppError(HttpStatus.NOT_FOUND, "Profile photo not found", "PROFILE_PHOTO_NOT_FOUND");
    }

    const previousKey = profile.profilePhoto;
    profile.profilePhoto = "";
    const updatedProfile = await this.candidateProfileRepository.update(profile);
    if (previousKey.startsWith("candidate-profiles/")) {
      await this.fileStorage.delete(previousKey);
    }
    return updatedProfile;
  }
}
