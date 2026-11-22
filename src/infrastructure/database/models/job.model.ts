import { model, Schema, type Document, Types } from "mongoose";
import type {
  JobEmploymentType,
  JobExperienceLevel,
  JobSalaryRange,
  JobStatus,
  JobWorkMode,
} from "../../../domain/entities/job.entity.js";

export interface JobDocument extends Document {
  recruiterId: Types.ObjectId;
  companyId: Types.ObjectId;
  companyName: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  employmentType: JobEmploymentType;
  workMode: JobWorkMode;
  experienceLevel: JobExperienceLevel;
  salaryRange: JobSalaryRange | null;
  openings: number;
  applicationDeadline: Date | null;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const salaryRangeSchema = new Schema<JobSalaryRange>({
  minimum: { type: Number, default: null, min: 0 },
  maximum: { type: Number, default: null, min: 0 },
  currency: { type: String, required: true, uppercase: true, trim: true },
}, { _id: false });

const jobSchema = new Schema<JobDocument>({
  recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  companyName: { type: String, trim: true, required: true },
  title: { type: String, trim: true, required: true, maxlength: 160 },
  description: { type: String, trim: true, required: true, maxlength: 12000 },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  location: { type: String, trim: true, required: true, maxlength: 160 },
  employmentType: { type: String, enum: ["full_time", "part_time", "contract", "internship", "temporary", "freelance"], required: true },
  workMode: { type: String, enum: ["remote", "hybrid", "onsite"], required: true },
  experienceLevel: { type: String, enum: ["internship", "entry", "junior", "mid", "senior", "lead", "executive"], required: true },
  salaryRange: { type: salaryRangeSchema, default: null },
  openings: { type: Number, min: 1, max: 1000, default: 1, required: true },
  applicationDeadline: { type: Date, default: null },
  status: { type: String, enum: ["draft", "published"], default: "draft", required: true, index: true },
}, { timestamps: true, versionKey: false });

jobSchema.index({ recruiterId: 1, status: 1, createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1 });

export const JobModel = model<JobDocument>("Job", jobSchema);
