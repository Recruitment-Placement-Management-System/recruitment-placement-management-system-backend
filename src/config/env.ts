import 'dotenv/config'
import {z} from 'zod';

const envSchema = z.object({
     NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

    PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // JWT_ACCESS_SECRET: z
  //   .string()
  //   .min(1, "JWT_ACCESS_SECRET is required"),

  // JWT_REFRESH_SECRET: z
  //   .string()
  //   .min(1, "JWT_REFRESH_SECRET is required"),

  //    EMAIL_HOST: z.string().optional(),
  // EMAIL_PORT: z.coerce.number().optional(),
  // EMAIL_USER: z.string().optional(),
  // EMAIL_PASSWORD: z.string().optional(),
  
})

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;