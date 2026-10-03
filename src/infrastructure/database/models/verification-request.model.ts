import { model, Schema, type Document, Types } from "mongoose";
import type {
  VerificationEntityType,
  VerificationPriority,
  VerificationRequestStatus,
} from "../../../domain/entities/verification-request.entity.js";

export interface VerificationRequestDocument extends Document {
  entityId: Types.ObjectId;
  entityType: VerificationEntityType;
  submittedBy: Types.ObjectId;
  reviewedBy?: Types.ObjectId;
  status: VerificationRequestStatus;
  priority: VerificationPriority;
  documents: string[];
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationRequestSchema =
  new Schema<VerificationRequestDocument>(
    {
      entityId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      entityType: {
        type: String,
        enum: ["recruiter"],
        required: true,
      },
      submittedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true,
      },
      priority: {
        type: String,
        enum: ["low", "normal", "high"],
        default: "normal",
        required: true,
      },
      documents: {
        type: [String],
        default: [],
      },
      adminNotes: {
        type: String,
        trim: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      reviewedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  );

export const VerificationRequestModel =
  model<VerificationRequestDocument>(
    "VerificationRequest",
    verificationRequestSchema,
  );