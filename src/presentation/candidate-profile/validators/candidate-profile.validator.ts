import { z } from "zod";

const jsonObjectSchema = z.record(z.string(), z.unknown());
const jsonArraySchema = z.array(jsonObjectSchema);
const profileItemArraySchema = z.array(z.union([z.string().trim().min(1), jsonObjectSchema]));

export const createCandidateProfileSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  profilePhoto: z.string().trim().max(2048).optional(),
  headline: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(3000).optional(),
  location: jsonObjectSchema.optional(),
  personalInfo: jsonObjectSchema.optional(),
  contactLinks: jsonObjectSchema.optional(),
  skills: profileItemArraySchema.optional(),
  education: jsonArraySchema.optional(),
  experience: jsonArraySchema.optional(),
  projects: jsonArraySchema.optional(),
  certifications: jsonArraySchema.optional(),
  languages: profileItemArraySchema.optional(),
  resume: jsonObjectSchema.optional(),
  jobPreferences: jsonObjectSchema.optional(),
}).strict();

export const updateCandidateProfileSchema = createCandidateProfileSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field must be provided",
  });
