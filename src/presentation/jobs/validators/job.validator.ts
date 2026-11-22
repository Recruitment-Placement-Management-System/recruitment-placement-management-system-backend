import { z } from "zod";

const employmentTypeSchema = z.enum(["full_time", "part_time", "contract", "internship", "temporary", "freelance"]);
const workModeSchema = z.enum(["remote", "hybrid", "onsite"]);
const experienceLevelSchema = z.enum(["internship", "entry", "junior", "mid", "senior", "lead", "executive"]);
const textList = (maxItems: number, maxLength: number) => z.array(z.string().trim().min(1).max(maxLength)).max(maxItems);

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Deadline must be a valid YYYY-MM-DD date");

const salaryRangeSchema = z.object({
  minimum: z.number().finite().nonnegative().max(1_000_000_000).nullable(),
  maximum: z.number().finite().nonnegative().max(1_000_000_000).nullable(),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
}).strict().refine(
  (salary) => salary.minimum !== null || salary.maximum !== null,
  "Provide a minimum or maximum salary",
).refine(
  (salary) => salary.minimum === null || salary.maximum === null || salary.minimum <= salary.maximum,
  { message: "Minimum salary cannot exceed maximum salary", path: ["maximum"] },
);

const jobFields = {
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(20).max(12000),
  responsibilities: textList(30, 1000),
  requirements: textList(30, 1000),
  skills: textList(50, 80).refine((items) => new Set(items.map((item) => item.toLowerCase())).size === items.length, "Skills must not contain duplicates"),
  location: z.string().trim().min(2).max(160),
  employmentType: employmentTypeSchema,
  workMode: workModeSchema,
  experienceLevel: experienceLevelSchema,
  salaryRange: salaryRangeSchema.nullable(),
  openings: z.number().int().min(1).max(1000),
  applicationDeadline: dateOnlySchema.nullable(),
};

export const createJobSchema = z.object({
  title: jobFields.title,
  description: jobFields.description,
  responsibilities: jobFields.responsibilities.optional(),
  requirements: jobFields.requirements.optional(),
  skills: jobFields.skills.optional(),
  location: jobFields.location,
  employmentType: jobFields.employmentType,
  workMode: jobFields.workMode,
  experienceLevel: jobFields.experienceLevel,
  salaryRange: jobFields.salaryRange.optional(),
  openings: jobFields.openings.optional(),
  applicationDeadline: jobFields.applicationDeadline.optional(),
}).strict();

export const updateJobSchema = z.object({
  title: jobFields.title.optional(),
  description: jobFields.description.optional(),
  responsibilities: jobFields.responsibilities.optional(),
  requirements: jobFields.requirements.optional(),
  skills: jobFields.skills.optional(),
  location: jobFields.location.optional(),
  employmentType: jobFields.employmentType.optional(),
  workMode: jobFields.workMode.optional(),
  experienceLevel: jobFields.experienceLevel.optional(),
  salaryRange: jobFields.salaryRange.optional(),
  openings: jobFields.openings.optional(),
  applicationDeadline: jobFields.applicationDeadline.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "At least one job field must be provided");

const queryFields = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().min(1).max(160).optional(),
  employmentType: employmentTypeSchema.optional(),
  workMode: workModeSchema.optional(),
  experienceLevel: experienceLevelSchema.optional(),
  skill: z.string().trim().min(1).max(80).optional(),
};

export const recruiterJobListQuerySchema = z.object({
  ...queryFields,
  status: z.enum(["draft", "published"]).optional(),
}).strict();

export const publishedJobSearchQuerySchema = z.object(queryFields).strict();
export const jobIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid job ID");
