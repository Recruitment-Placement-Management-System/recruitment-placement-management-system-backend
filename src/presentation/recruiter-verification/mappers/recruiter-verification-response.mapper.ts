import type { RecruiterVerificationHistoryItemDto } from "../../../application/dto/recruiter-verification/recruiter-verification.dto.js";
import type { VerificationRequest } from "../../../domain/entities/verification-request.entity.js";
import type { IFileStorageService } from "../../../application/interfaces/services/file-storage.service.js";

export class RecruiterVerificationResponseMapper {
  constructor(private readonly fileStorage: IFileStorageService) {}

  async toDto(request: VerificationRequest): Promise<RecruiterVerificationHistoryItemDto> {
    const documents = await Promise.all(request.documents.map((document) =>
      document.startsWith("recruiter-verification/")
        ? this.fileStorage.getDownloadUrl(document)
        : Promise.resolve(document),
    ));

    return {
      _id: request.id ?? "",
      status: request.status,
      priority: request.priority,
      documents,
      ...(request.adminNotes !== undefined && { adminNotes: request.adminNotes }),
      submittedAt: request.submittedAt.toISOString(),
      ...(request.reviewedAt !== undefined && { reviewedAt: request.reviewedAt.toISOString() }),
    };
  }

  toHistoryDto(requests: VerificationRequest[]): Promise<RecruiterVerificationHistoryItemDto[]> {
    return Promise.all(requests.map((request) => this.toDto(request)));
  }
}
