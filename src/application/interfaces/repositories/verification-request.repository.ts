import type { VerificationRequest } from "../../../domain/entities/verification-request.entity.js";

export interface IVerificationRequestRepository {
  findByEntity(
    entityId: string,
    entityType: "recruiter",
  ): Promise<VerificationRequest | null>;

  create(request: VerificationRequest): Promise<VerificationRequest>;

  update(request: VerificationRequest): Promise<VerificationRequest>;
}