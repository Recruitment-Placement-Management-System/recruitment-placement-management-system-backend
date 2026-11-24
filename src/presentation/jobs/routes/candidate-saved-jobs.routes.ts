import { Router } from "express";
import type { CandidateSavedJobsControllerDependencies } from "../controllers/candidate-saved-jobs.controller.js";
import { createCandidateSavedJobsController } from "../controllers/candidate-saved-jobs.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";

export const createCandidateSavedJobsRouter = (dependencies: CandidateSavedJobsControllerDependencies) => {
  const router = Router();
  const controller = createCandidateSavedJobsController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));
  
  router.get("/", controller.list);
  router.post("/:jobId", controller.save);
  router.delete("/:jobId", controller.remove);
  return router;
};
