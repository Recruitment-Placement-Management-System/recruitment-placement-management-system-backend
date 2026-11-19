import { randomUUID } from "node:crypto";
import { VerificationRequest } from "../../../domain/entities/verification-request.entity.js";
import type { SubmitRecruiterVerificationDto } from "../../dto/recruiter-verification/recruiter-verification.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import type { IVerificationRequestRepository } from "../../interfaces/repositories/verification-request.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const extensionByContentType: Record<"application/pdf" | "image/jpeg" | "image/png", string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export class SubmitRecruiterVerificationUseCase {
  constructor(
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    private readonly verificationRequestRepository: IVerificationRequestRepository,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async execute(userId: string, input: SubmitRecruiterVerificationDto) {
    const profile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }
    if (profile.verificationStatus === "verified") {
      throw new AppError(HttpStatus.CONFLICT, "Recruiter is already verified", "RECRUITER_ALREADY_VERIFIED");
    }

    const requests = await this.verificationRequestRepository.findAllByEntity(profile.id!, "recruiter");
    const pendingRequest = requests.find((request) => request.status === "pending");
    if (pendingRequest?.documents.length) {
      throw new AppError(HttpStatus.CONFLICT, "A verification request is already pending review", "VERIFICATION_ALREADY_PENDING");
    }

    const submissionId = randomUUID();
    const uploadedKeys: string[] = [];
    try {
      for (let index = 0; index < input.files.length; index += 1) {
        const file = input.files[index]!;
        const extension = extensionByContentType[file.contentType];
        const key = `recruiter-verification/${profile.id}/${submissionId}/${index + 1}-${randomUUID()}.${extension}`;
        await this.fileStorage.upload({ buffer: file.buffer, contentType: file.contentType, key });
        uploadedKeys.push(key);
      }
    } catch (error) {
      await Promise.all(uploadedKeys.map((key) => this.fileStorage.delete(key).catch(() => undefined)));
      throw error;
    }

    const previousStatus = profile.verificationStatus;
    if (previousStatus !== "pending") {
      profile.verificationStatus = "pending";
      try {
        await this.recruiterProfileRepository.update(profile);
      } catch (error) {
        await Promise.all(uploadedKeys.map((key) => this.fileStorage.delete(key).catch(() => undefined)));
        throw error;
      }
    }

    const now = new Date();
    const request = pendingRequest
      ? new VerificationRequest(
        pendingRequest.id,
        pendingRequest.entityId,
        pendingRequest.entityType,
        pendingRequest.submittedBy,
        "pending",
        pendingRequest.priority,
        uploadedKeys,
        undefined,
        undefined,
        now,
        undefined,
        pendingRequest.createdAt,
        now,
      )
      : new VerificationRequest(
        undefined,
        profile.id!,
        "recruiter",
        userId,
        "pending",
        "normal",
        uploadedKeys,
        undefined,
        undefined,
        now,
      );

    try {
      return pendingRequest
        ? await this.verificationRequestRepository.update(request)
        : await this.verificationRequestRepository.create(request);
    } catch (error) {
      if (previousStatus !== "pending") {
        profile.verificationStatus = previousStatus;
        await this.recruiterProfileRepository.update(profile).catch(() => undefined);
      }
      await Promise.all(uploadedKeys.map((key) => this.fileStorage.delete(key).catch(() => undefined)));
      throw error;
    }
  }
}
