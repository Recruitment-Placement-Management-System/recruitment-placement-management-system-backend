import { Router } from "express";
import { registerCandidate,resendVerificatioEmail,verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerCandidateSchema,verifyEmailSchema,resendVerificationEmailSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);
router.post('/verify-email',validate(verifyEmailSchema),verifyEmail)

router.post('/resend-verification',validate(resendVerificationEmailSchema),resendVerificatioEmail)

export default router;