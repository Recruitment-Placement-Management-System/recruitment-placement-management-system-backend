import { z } from "zod";

const websiteSchema = z.string().trim().url().max(2048).refine((value) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}, "Company website must use HTTP or HTTPS");

export const updateRecruiterCompanySchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  location: z.string().trim().min(2).max(200).optional(),
  website: websiteSchema.optional(),
}).strict().refine(
  (value) => Object.keys(value).length > 0,
  "At least one company field must be provided",
);
