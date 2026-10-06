import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { adminLoginSchema } from "../validators/admin.validator.js";
import { adminLogin } from "../controllers/admin-login.controller.js";

const router = Router();

router.post('/login',validate(adminLoginSchema),adminLogin)

export default router;