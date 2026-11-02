import type { VerificationRequest } from "../../../domain/entities/verification-request.entity.js";
import type { IRepository } from "./repository.js";

export interface IVerificationRequestRepository extends IRepository<VerificationRequest> {
  findByEntity(
    entityId: string,
    entityType: "recruiter",
  ): Promise<VerificationRequest | null>;
}
