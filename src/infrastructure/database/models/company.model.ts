import { model, Schema, type Document } from "mongoose";
import type {
  CompanyStatus,
  CompanyVerificationStatus,
} from "../../../domain/entities/company.entity.js";

export interface CompanyDocument extends Document {
  name: string;
  location: string;
  website: string;
  status: CompanyStatus;
  verificationStatus: CompanyVerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<CompanyDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
      required: true,
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

export const CompanyModel = model<CompanyDocument>(
  "Company",
  companySchema,
);