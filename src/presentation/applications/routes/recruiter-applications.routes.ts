import { Router } from "express";
import type { RecruiterApplicationsDependencies } from "../controllers/recruiter-applications.controller.js";
import { createRecruiterApplicationsController } from "../controllers/recruiter-applications.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";

export const createRecruiterApplicationsRouter = (dependencies: RecruiterApplicationsDependencies) => {
  const router = Router();
  const controller = createRecruiterApplicationsController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("recruiter"));
  
  router.get("/", controller.list);
  router.get("/:applicationId", controller.get);
  router.patch("/:applicationId/status", controller.updateStatus);
  return router;
};
