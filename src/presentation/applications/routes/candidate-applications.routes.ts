import { Router } from "express";
import type { CandidateApplicationsDependencies } from "../controllers/candidate-applications.controller.js";
import { createCandidateApplicationsController } from "../controllers/candidate-applications.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";

export const createCandidateApplicationsRouter = (dependencies: CandidateApplicationsDependencies) => {
  const router = Router();
  const controller = createCandidateApplicationsController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));
  
  router.post("/jobs/:jobId", controller.submit);
  router.get("/", controller.list);
  router.get("/:applicationId", controller.get);
  router.patch("/:applicationId/withdraw", controller.withdraw);
  return router;
};