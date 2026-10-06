import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { registerCandidate,resendVerificatioEmail,verifyEmail,registerRecruiter,login,forgotPassword,resetPassword,refreshAccessToken,logout } from "../controllers/auth.controller.js";
import { registerCandidateSchema,verifyEmailSchema,resendVerificationEmailSchema,
    registerRecruiterSchema,loginSchema,forgotPasswordSchema,resetPasswordSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);
router.post('/verify-email',validate(verifyEmailSchema),verifyEmail)

router.post('/resend-verification',validate(resendVerificationEmailSchema),resendVerificatioEmail)

router.post('/register/recruiter',validate(registerRecruiterSchema),registerRecruiter)

router.post('/login',validate(loginSchema),login)

router.post('/forgot-password',validate(forgotPasswordSchema),forgotPassword)
router.post('/reset-password',validate(resetPasswordSchema),resetPassword)

router.post('/refresh-token',refreshAccessToken);

router.post('/logout',logout)

export default router;