import { z } from "zod";

export const updateRecruiterProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  designation: z.string().trim().min(2).max(120).optional(),
}).strict().refine(
  (value) => Object.keys(value).length > 0,
  "At least one recruiter profile field must be provided",
);