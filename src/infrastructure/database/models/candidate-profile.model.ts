import { model, Schema, type Document, type SchemaDefinitionProperty, Types } from "mongoose";
import type {
  CandidateProfileJson,
  CandidateProfileItem,
  CandidateEducation,
  CandidateExperience,
  CandidateProject,
  CandidateCertification,
  CandidateLanguage,
  CandidateResume,
  CandidateVerificationStatus,
} from "../../../domain/entities/candidate-profile.entity.js";

export interface CandidateProfileDocument extends Document {
  userId: Types.ObjectId;
  fullName: string;
  profilePhoto: string;
  headline: string;
  bio: string;
  location: CandidateProfileJson;
  personalInfo: CandidateProfileJson;
  contactLinks: CandidateProfileJson;
  skills: CandidateProfileItem[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  languages: CandidateLanguage[];
  resume: CandidateResume | null;
  jobPreferences: CandidateProfileJson;
  verificationStatus: CandidateVerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const jsonObject = { type: Schema.Types.Mixed, default: () => ({}) };
const jsonArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateProfileItem[], CandidateProfileDocument>;
const educationArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateEducation[], CandidateProfileDocument>;
const experienceArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateExperience[], CandidateProfileDocument>;
const projectArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateProject[], CandidateProfileDocument>;
const certificationArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateCertification[], CandidateProfileDocument>;
const languageArray = {
  type: [Schema.Types.Mixed],
  default: () => [],
} as unknown as SchemaDefinitionProperty<CandidateLanguage[], CandidateProfileDocument>;

const candidateProfileSchema = new Schema<CandidateProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, trim: true, default: "" },
    profilePhoto: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    location: jsonObject,
    personalInfo: jsonObject,
    contactLinks: jsonObject,
    skills: jsonArray,
    education: educationArray,
    experience: experienceArray,
    projects: projectArray,
    certifications: certificationArray,
    languages: languageArray,
    resume: { type: Schema.Types.Mixed, default: null },
    jobPreferences: jsonObject,
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const CandidateProfileModel = model<CandidateProfileDocument>(
  "CandidateProfile",
  candidateProfileSchema,
);
