import { Router } from "express";
import { registerCandidate,verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerCandidateSchema,verifyEmailSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);
router.post('/verify-email',validate(verifyEmailSchema),verifyEmail)

export default router;