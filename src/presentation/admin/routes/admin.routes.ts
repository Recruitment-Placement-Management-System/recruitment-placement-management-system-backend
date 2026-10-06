import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { adminLoginSchema } from "../validators/admin.validator.js";
import { adminLogin } from "../controllers/admin-login.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { adminListUsers } from "../controllers/admin-users.controller.js";

const router = Router();

router.post('/login',validate(adminLoginSchema),adminLogin)

router.get('/users',authenticate,authorize("admin"),adminListUsers)

export default router;