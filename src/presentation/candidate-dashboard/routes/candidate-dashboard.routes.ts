import { Router } from "express";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { createCandidateDashboardController } from "../controllers/candidate-dashboard.controller.js";
import type { CandidateDashboardControllerDependencies } from "../controllers/candidate-dashboard.controller.js";

export const createCandidateDashboardRouter = (dependencies: CandidateDashboardControllerDependencies) => {
  const router = Router();
  const controller = createCandidateDashboardController(dependencies);
  
  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));

  router.get("/", controller.get);
  return router;
};
