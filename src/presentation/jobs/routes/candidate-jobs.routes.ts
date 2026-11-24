import { Router } from "express";
import type { CandidateJobsControllerDependencies } from "../controllers/candidate-jobs.controller.js";
import { createCandidateJobsController } from "../controllers/candidate-jobs.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";

export const createCandidateJobsRouter = (dependencies: CandidateJobsControllerDependencies) => {
  const router = Router();
  const controller = createCandidateJobsController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));
  
  router.get("/", controller.browse);
  router.get("/:jobId/related", controller.related);
  router.get("/:jobId", controller.details);
  return router;
};
