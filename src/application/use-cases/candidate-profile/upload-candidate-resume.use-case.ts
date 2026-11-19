import { randomUUID } from "node:crypto";
import { basename } from "node:path";
import type { CandidateResumeUploadDto } from "../../dto/candidate-profile/candidate-resume-upload.dto.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const resumeExtensions: Record<CandidateResumeUploadDto["contentType"], string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export class UploadCandidateResumeUseCase {
  constructor(
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async execute(userId: string, input: CandidateResumeUploadDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const extension = resumeExtensions[input.contentType];
    if (!extension) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Only PDF and DOCX resumes are supported", "INVALID_RESUME_TYPE");
    }

    const fileName = basename(input.fileName).replace(/[^\w. -]/g, "_").slice(0, 180);
    const previousResume = profile.resume;
    const storageKey = `candidate-profiles/${userId}/resume/${randomUUID()}.${extension}`;
    await this.fileStorage.upload({
      buffer: input.buffer,
      contentType: input.contentType,
      key: storageKey,
    });

    profile.resume = {
      storageKey,
      fileName,
      contentType: input.contentType,
      fileSize: input.fileSize,
      uploadedAt: new Date().toISOString(),
      parsingStatus: "pending",
    };

    try {
      const updatedProfile = await this.candidateProfileRepository.update(profile);
      if (previousResume) {
        await this.fileStorage.delete(previousResume.storageKey).catch(() => undefined);
      }
      return updatedProfile;
    } catch (error) {
      await this.fileStorage.delete(storageKey).catch(() => undefined);
      throw error;
    }
  }
}
