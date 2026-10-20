import { Router } from "express";
import type { AdminControllerDependencies } from "../admin.dependencies.js";
import { createAdminLoginController } from "../controllers/admin-login.controller.js";
import { createAdminUsersController } from "../controllers/admin-users.controller.js";
import { adminLoginSchema } from "../validators/admin.validator.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";

export const createAdminRouter = (dependencies: AdminControllerDependencies) => {
  const router = Router();
  router.post("/login", validate(adminLoginSchema), createAdminLoginController(dependencies));
  router.get("/users", createAuthenticate(dependencies.tokenService), authorize("admin"), createAdminUsersController(dependencies));
  return router;
};
