import { Router } from "express";
import { registerCandidate,resendVerificatioEmail,verifyEmail,registerRecruiter,login,forgotPassword } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerCandidateSchema,verifyEmailSchema,resendVerificationEmailSchema,
    registerRecruiterSchema,loginSchema,forgotPasswordSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);
router.post('/verify-email',validate(verifyEmailSchema),verifyEmail)

router.post('/resend-verification',validate(resendVerificationEmailSchema),resendVerificatioEmail)

router.post('/register/recruiter',validate(registerRecruiterSchema),registerRecruiter)

router.post('/login',validate(loginSchema),login)

router.post('/forgot-password',validate(forgotPasswordSchema),forgotPassword)

export default router;