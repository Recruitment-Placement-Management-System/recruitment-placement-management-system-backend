import {z} from "zod";

export const registerCandidateSchema = z.object({
    fullName:z.string().trim().min(2,'Name must be atleast 2 characters'),
    
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
});

export const resendVerificationEmailSchema = z.object({
    email:z.string().trim().email('Invalid email address')
});

export const registerRecruiterSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(10, "Invalid phone number"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  designation: z.string().trim().min(2, "Designation is required"),
  companyName: z.string().trim().min(2, "Company name is required"),
  companyLocation: z.string().trim().min(2, "Company location is required"),
  companyWebsite: z.string().trim().url("Invalid company website"),
});

export const loginSchema = z.object({
    email:z.string().trim().email('Invalid email address'),
    password:z.string().min(1,'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email:z.string().trim().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
    token:z.string().trim().min(1,'Reset token is required'),
    newPassword:z.string().min(8,"Password must be atleast 8 characters long"),
})