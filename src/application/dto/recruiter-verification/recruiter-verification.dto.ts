import type {
  VerificationPriority,
  VerificationRequestStatus,
} from "../../../domain/entities/verification-request.entity.js";

export interface VerificationEvidenceFileDto {
  buffer: Buffer;
  contentType: "application/pdf" | "image/jpeg" | "image/png";
}

export interface SubmitRecruiterVerificationDto {
  files: VerificationEvidenceFileDto[];
}

export interface RecruiterVerificationHistoryItemDto {
  _id: string;
  status: VerificationRequestStatus;
  priority: VerificationPriority;
  documents: string[];
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}
