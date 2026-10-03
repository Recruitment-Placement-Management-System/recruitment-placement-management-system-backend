import { Router } from "express";
import { registerCandidate,resendVerificatioEmail,verifyEmail,registerRecruiter,login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerCandidateSchema,verifyEmailSchema,resendVerificationEmailSchema,registerRecruiterSchema,loginSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);
router.post('/verify-email',validate(verifyEmailSchema),verifyEmail)

router.post('/resend-verification',validate(resendVerificationEmailSchema),resendVerificatioEmail)

router.post('/register/recruiter',validate(registerRecruiterSchema),registerRecruiter)

router.post('/login',validate(loginSchema),login)

export default router;