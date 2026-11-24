import { model, Schema, Types, type Document } from "mongoose";
import type { JobApplicationStatus } from "../../../domain/entities/job-application.entity.js";

export interface JobApplicationDocument extends Document {
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  resume: { storageKey: string; fileName: string; contentType: string };
  coverLetter: string;
  status: JobApplicationStatus;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<JobApplicationDocument>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  candidateName: { type: String, required: true, trim: true, maxlength: 160 },
  candidateEmail: { type: String, required: true, lowercase: true, trim: true },
  candidatePhone: { type: String, default: null, trim: true },
  resume: {
    storageKey: { type: String, required: true },
    fileName: { type: String, required: true },
    contentType: { type: String, required: true },
  },
  coverLetter: { type: String, default: "", maxlength: 5000 },
  status: { type: String, enum: ["submitted", "under_review", "shortlisted", "rejected", "withdrawn"], default: "submitted", required: true, index: true },
  submittedAt: { type: Date, default: Date.now, required: true },
}, { timestamps: true, versionKey: false });

jobApplicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
jobApplicationSchema.index({ recruiterId: 1, status: 1, submittedAt: -1 });

export const JobApplicationModel = model<JobApplicationDocument>("JobApplication", jobApplicationSchema);
