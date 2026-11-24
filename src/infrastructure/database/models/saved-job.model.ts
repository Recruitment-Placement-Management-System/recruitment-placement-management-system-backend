import { model, Schema, type Document, Types } from "mongoose";

export interface SavedJobDocument extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const savedJobSchema = new Schema<SavedJobDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
}, { timestamps: true, versionKey: false });

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
savedJobSchema.index({ userId: 1, createdAt: -1 });

export const SavedJobModel = model<SavedJobDocument>("SavedJob", savedJobSchema);
