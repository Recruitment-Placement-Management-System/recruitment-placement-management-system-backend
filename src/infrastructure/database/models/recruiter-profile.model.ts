import { model, Schema, type Document, Types } from "mongoose";
import type { RecruiterVerificationStatus } from "../../../domain/entities/recruiter-profile.entity.js";

export interface RecruiterProfileDocument extends Document {
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  fullName: string;
  designation: string;
  verificationStatus: RecruiterVerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const recruiterProfileSchema = new Schema<RecruiterProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const RecruiterProfileModel = model<RecruiterProfileDocument>(
  "RecruiterProfile",
  recruiterProfileSchema,
);