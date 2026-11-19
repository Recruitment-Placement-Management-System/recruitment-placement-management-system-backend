import { Router } from "express";
import type { RecruiterProfileControllerDependencies } from "../controllers/recruiter-profile.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";
import { createRecruiterProfileController } from "../controllers/recruiter-profile.controller.js";
import { updateRecruiterProfileSchema } from "../validators/recruiter-profile.validator.js";

export const createRecruiterProfileRouter = (dependencies: RecruiterProfileControllerDependencies) => {
  const router = Router();
  const controller = createRecruiterProfileController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("recruiter"));

  router.get("/", controller.get);
  router.patch("/", validate(updateRecruiterProfileSchema), controller.update);
  return router;
};