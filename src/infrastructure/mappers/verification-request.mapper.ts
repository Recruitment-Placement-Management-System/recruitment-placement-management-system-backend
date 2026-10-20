import { VerificationRequest } from "../../domain/entities/verification-request.entity.js";
import type { VerificationRequestDocument } from "../database/models/verification-request.model.js";

export class VerificationRequestMapper {
  static toDomain(document: VerificationRequestDocument): VerificationRequest {
    return new VerificationRequest(String(document._id), String(document.entityId),
      document.entityType, String(document.submittedBy), document.status,
      document.priority, document.documents, document.adminNotes,
      document.reviewedBy ? String(document.reviewedBy) : undefined,
      document.submittedAt, document.reviewedAt, document.createdAt, document.updatedAt);
  }

  static toPersistence(request: VerificationRequest) {
    return {
      entityId: request.entityId, entityType: request.entityType,
      submittedBy: request.submittedBy, status: request.status,
      priority: request.priority, documents: request.documents,
      submittedAt: request.submittedAt,
      ...(request.adminNotes !== undefined && { adminNotes: request.adminNotes }),
      ...(request.reviewedBy !== undefined && { reviewedBy: request.reviewedBy }),
      ...(request.reviewedAt !== undefined && { reviewedAt: request.reviewedAt }),
    };
  }
}
