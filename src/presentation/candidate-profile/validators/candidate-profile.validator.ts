import { z } from "zod";

const jsonObjectSchema = z.record(z.string(), z.unknown());
const jsonArraySchema = z.array(jsonObjectSchema);
const profileItemArraySchema = z.array(z.union([z.string().trim().min(1), jsonObjectSchema]));
const skillNameSchema = z.string().trim().min(1, "Skill name is required").max(80, "Skill name cannot exceed 80 characters");
const educationDateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD").refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Date must be a valid calendar date"),
  z.literal(""),
]);
const candidateEducationSchema = z.object({
  institution: z.string().trim().min(1).max(160),
  degree: z.string().trim().min(1).max(160),
  fieldOfStudy: z.string().trim().max(160).optional(),
  startDate: educationDateSchema.optional(),
  endDate: educationDateSchema.optional(),
  grade: z.string().trim().max(80).optional(),
  description: z.string().trim().max(2000).optional(),
}).strict();
const uniqueSkillArraySchema = z.array(skillNameSchema).refine((skills) => {
  const names = skills.map((skill) => skill.toLowerCase());
  return new Set(names).size === names.length;
}, "Skills must not contain duplicates");

export const createCandidateProfileSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  profilePhoto: z.string().trim().max(2048).optional(),
  headline: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(3000).optional(),
  location: jsonObjectSchema.optional(),
  personalInfo: jsonObjectSchema.optional(),
  contactLinks: jsonObjectSchema.optional(),
  skills: uniqueSkillArraySchema.optional(),
  education: z.array(candidateEducationSchema).optional(),
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

export const addCandidateSkillsSchema = z.object({
  skills: z.array(skillNameSchema).min(1, "Provide at least one skill").max(30, "You can add up to 30 skills at a time"),
}).strict();

export const updateCandidateSkillSchema = z.object({
  currentSkill: skillNameSchema,
  newSkill: skillNameSchema,
}).strict();

export const removeCandidateSkillSchema = z.object({
  skill: skillNameSchema,
}).strict();

export const addCandidateEducationSchema = candidateEducationSchema;

const educationUpdateFieldsSchema = candidateEducationSchema.partial();
export const updateCandidateEducationSchema = z.object({
  index: z.number().int().min(0),
  institution: educationUpdateFieldsSchema.shape.institution,
  degree: educationUpdateFieldsSchema.shape.degree,
  fieldOfStudy: educationUpdateFieldsSchema.shape.fieldOfStudy,
  startDate: educationUpdateFieldsSchema.shape.startDate,
  endDate: educationUpdateFieldsSchema.shape.endDate,
  grade: educationUpdateFieldsSchema.shape.grade,
  description: educationUpdateFieldsSchema.shape.description,
}).strict().refine(
  (value) => Object.keys(value).some((key) => key !== "index"),
  "At least one education field must be provided",
  );

export const deleteCandidateEducationSchema = z.object({
  index: z.number().int().min(0),
}).strict();
