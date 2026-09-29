import {z} from "zod";

export const registerCandidateSchema = z.object({
    email:z.string().trim().email('Invalid email address'),

    password:z.string().min(8,'Password must be at least 8 characters'),

    phone:z.string().trim().optional(),
});

export const verifyEmailSchema = z.object({
    email:z.string().trim().email('Invalid email address'),
    verificationCode:z.
    string()
    .trim()
    .length(6,'Verification code must be 6 digits')
    .regex(/^\d+$/, "Verification code must contain only digits")
})

export const resendVerificationEmailSchema = z.object({
    email:z.string().trim().email('Invalid email address')
})