import type { IVerificationRequestRepository } from "../../application/interfaces/repositories/verification-request.repository.js";
import { VerificationRequest } from "../../domain/entities/verification-request.entity.js";

 import {  VerificationRequestModel } from "../database/models/verification-request.model.js";
 import { VerificationRequestMapper } from "../mappers/verification-request.mapper.js";

export class MongoVerificationRequestRepository implements IVerificationRequestRepository{
  async findByEntity(entityId: string, entityType: "recruiter"): Promise<VerificationRequest | null> {
    const request = await VerificationRequestModel.findOne({
      entityId,
      entityType,
    }).exec()

    if(!request)return null ;

    return VerificationRequestMapper.toDomain(request);
  }


  async create(request: VerificationRequest): Promise<VerificationRequest> {
    const createdRequest = await VerificationRequestModel.create(
      VerificationRequestMapper.toPersistence(request),
    )

    return VerificationRequestMapper.toDomain(createdRequest)
  }

  async update(
  request: VerificationRequest,
): Promise<VerificationRequest> {
  const updatedRequest =
    await VerificationRequestModel.findByIdAndUpdate(
      request.id,
      {
        $set: VerificationRequestMapper.toPersistence(request),
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

  if (!updatedRequest) {
    throw new Error("Verification request not found");
  }

  return VerificationRequestMapper.toDomain(updatedRequest);
}
}
