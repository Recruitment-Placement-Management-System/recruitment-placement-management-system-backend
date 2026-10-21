import type { IVerificationRequestRepository } from "../../application/interfaces/repositories/verification-request.repository.js";
import { VerificationRequest } from "../../domain/entities/verification-request.entity.js";

 import {  VerificationRequestModel } from "../database/models/verification-request.model.js";
 import { VerificationRequestMapper } from "../mappers/verification-request.mapper.js";
 import { MongoBaseRepository } from "./mongo-base.repository.js";

export class MongoVerificationRequestRepository extends MongoBaseRepository<VerificationRequest, import("../database/models/verification-request.model.js").VerificationRequestDocument, ReturnType<typeof VerificationRequestMapper.toPersistence>> implements IVerificationRequestRepository {
  constructor() {
    super(VerificationRequestModel, VerificationRequestMapper.toDomain, VerificationRequestMapper.toPersistence, (request) => ({ $set: VerificationRequestMapper.toPersistence(request) }), "Verification request not found");
  }

  async findByEntity(entityId: string, entityType: "recruiter"): Promise<VerificationRequest | null> {
    const request = await VerificationRequestModel.findOne({
      entityId,
      entityType,
    }).exec()

    if(!request)return null ;

    return VerificationRequestMapper.toDomain(request);
  }


}
