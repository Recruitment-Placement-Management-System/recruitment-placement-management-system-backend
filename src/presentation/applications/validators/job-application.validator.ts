import { z } from "zod";

export const jobApplicationIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid application ID");
export const submitJobApplicationSchema = z.object({ coverLetter: z.string().trim().max(5000).default("") }).strict();
export const applicationStatusSchema = z.object({ status: z.enum(["under_review", "shortlisted", "rejected"]) }).strict();
export const applicationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["submitted", "under_review", "shortlisted", "rejected", "withdrawn"]).optional(),
  jobId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
}).strict();
