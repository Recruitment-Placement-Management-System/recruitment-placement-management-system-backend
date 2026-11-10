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

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must use YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Date of birth must be a valid calendar date");

const clearableText = (max: number) => z.string().trim().max(max);
const clearableUrl = z.string().trim().max(2048).refine(
  (value) => {
    if (value === "") return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  "Must be a valid URL or an empty string",
);

export const updateCandidatePersonalInformationSchema = z.object({
  personalInfo: z.object({
    dateOfBirth: z.union([dateOnlySchema, z.literal("")]).optional(),
    gender: clearableText(50).optional(),
    nationality: clearableText(100).optional(),
    maritalStatus: clearableText(50).optional(),
  }).strict().optional(),
  location: z.object({
    city: clearableText(120).optional(),
    state: clearableText(120).optional(),
    country: clearableText(120).optional(),
    postalCode: clearableText(24).optional(),
  }).strict().optional(),
  contactLinks: z.object({
    linkedin: clearableUrl.optional(),
    github: clearableUrl.optional(),
    portfolio: clearableUrl.optional(),
  }).strict().optional(),
}).strict().refine(
  (value) => Object.values(value).some((section) => section && Object.keys(section).length > 0),
  "At least one personal information field must be provided",
);
