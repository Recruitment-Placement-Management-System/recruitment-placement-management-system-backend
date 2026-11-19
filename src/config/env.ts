import 'dotenv/config'
import {z} from 'zod';

const envSchema = z.object({
     NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

    PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  AWS_ACCESS_KEY_ID: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.string().trim().min(1).optional(),
  ),
  AWS_SECRET_ACCESS_KEY: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.string().trim().min(1).optional(),
  ),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_S3_BUCKET: z.string().min(1, "AWS_S3_BUCKET is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(1, "JWT_ACCESS_SECRET is required"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(1, "JWT_REFRESH_SECRET is required"),

    SMTP_USER: z
    .string()
    .email("SMTP_USER must be a valid email"),

  SMTP_APP_PASSWORD: z
    .string()
    .min(1, "SMTP_APP_PASSWORD is required"),
  
}).superRefine((values, context) => {
  if (Boolean(values.AWS_ACCESS_KEY_ID) !== Boolean(values.AWS_SECRET_ACCESS_KEY)) {
    context.addIssue({
      code: "custom",
      message: "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be provided together",
      path: [values.AWS_ACCESS_KEY_ID ? "AWS_SECRET_ACCESS_KEY" : "AWS_ACCESS_KEY_ID"],
    });
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
