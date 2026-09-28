import { Router } from "express";
import { registerCandidate } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerCandidateSchema } from "../validators/auth.validator.js";

const router = Router()

router.post('/register',validate(registerCandidateSchema),registerCandidate);

export default router;