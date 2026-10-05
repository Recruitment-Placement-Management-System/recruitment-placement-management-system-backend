import type { IVerificationRequestRepository } from "../../application/interfaces/repositories/verification-request.repository.js";
import  { 
  VerificationRequest,
  VerificationEntityType,
  VerificationPriority,
  VerificationRequestStatus
 } from "../../domain/entities/verification-request.entity.js";

 import {  VerificationRequestModel } from "../database/models/verification-request.model.js";

export class MongoVerificationRequestRepository implements IVerificationRequestRepository{
  private toDomain(document:{
    _id:unknown;
    entityId:unknown;
    entityType:VerificationEntityType;
    submittedBy:unknown;
    status:VerificationRequestStatus;
    priority:VerificationPriority;
    documents:string[];
    adminNotes?:string;
    reviewedBy?:unknown;
    submittedAt:Date;
    reviewedAt?:Date;
    createdAt:Date;
    updatedAt:Date;
  }):VerificationRequest{
    return new VerificationRequest(
      String(document._id),
      String(document.entityId),
      document.entityType,
      String(document.submittedBy),
      document.status,
      document.priority,
      document.documents,
      document.adminNotes,
      document.reviewedBy?String(document.reviewedBy):undefined,
      document.submittedAt,
      document.reviewedAt,
      document.createdAt,
      document.updatedAt
    )
  }

  async findByEntity(entityId: string, entityType: "recruiter"): Promise<VerificationRequest | null> {
    const request = await VerificationRequestModel.findOne({
      entityId,
      entityType,
    }).exec()

    if(!request)return null ;

    return this.toDomain(request);
  }


  async create(request: VerificationRequest): Promise<VerificationRequest> {
    const createdRequest = await VerificationRequestModel.create({
      entityId:request.entityId,
      entityType:request.entityType,
      submittedBy:request.submittedBy,
      status:request.status,
      priority:request.priority,
      documents:request.documents,
      submittedAt:request.submittedAt,
      ...(request.adminNotes !== undefined && {
        adminNotes:request.adminNotes,
      }),
      ...(request.reviewedBy !== undefined && {
        reviewedBy:request.reviewedBy,
      }),
      ...(request.reviewedAt !== undefined && {
        reviewedAt:request.reviewedAt,
      }),
    })

    return this.toDomain(createdRequest)
  }

  async update(
  request: VerificationRequest,
): Promise<VerificationRequest> {
  const updatedRequest =
    await VerificationRequestModel.findByIdAndUpdate(
      request.id,
      {
        $set: {
          entityId: request.entityId,
          entityType: request.entityType,
          submittedBy: request.submittedBy,
          status: request.status,
          priority: request.priority,
          documents: request.documents,
          submittedAt: request.submittedAt,
          ...(request.reviewedBy !== undefined && {
            reviewedBy: request.reviewedBy,
          }),
          ...(request.reviewedAt !== undefined && {
            reviewedAt: request.reviewedAt,
          }),
          ...(request.adminNotes !== undefined && {
            adminNotes: request.adminNotes,
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

  if (!updatedRequest) {
    throw new Error("Verification request not found");
  }

  return this.toDomain(updatedRequest);
}
}