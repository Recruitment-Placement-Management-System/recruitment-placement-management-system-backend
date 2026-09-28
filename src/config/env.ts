import 'dotenv/config'
import {z} from 'zod';

const envSchema = z.object({
     NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

    PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(1, "JWT_ACCESS_SECRET is required"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(1, "JWT_REFRESH_SECRET is required"),

  RESEND_API_KEY: z
  .string()
  .min(1,'RESEND_API_KEY is required'),

  EMAIL_FROM: z
  .string()
  .email('EMAIL_FROM must be a valid email')
  
})

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;