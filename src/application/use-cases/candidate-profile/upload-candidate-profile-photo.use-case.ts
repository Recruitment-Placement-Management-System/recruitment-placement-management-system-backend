import { randomUUID } from "node:crypto";
import type { CandidateProfilePhotoDto } from "../../dto/candidate-profile/candidate-profile-photo.dto.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class UploadCandidateProfilePhotoUseCase {
  constructor(
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async execute(userId: string, input: CandidateProfilePhotoDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const extension = imageExtensions[input.contentType];
    if (!extension) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, and WebP images are supported", "INVALID_PROFILE_PHOTO_TYPE");
    }

    const previousKey = profile.profilePhoto;
    const key = `candidate-profiles/${userId}/profile-photo/${randomUUID()}.${extension}`;
    await this.fileStorage.upload({ buffer: input.buffer, contentType: input.contentType, key });

    profile.profilePhoto = key;
    try {
      const updatedProfile = await this.candidateProfileRepository.update(profile);
      if (previousKey.startsWith("candidate-profiles/") && previousKey !== key) {
        await this.fileStorage.delete(previousKey).catch(() => undefined);
      }
      return updatedProfile;
    } catch (error) {
      await this.fileStorage.delete(key).catch(() => undefined);
      throw error;
    }
  }
}
