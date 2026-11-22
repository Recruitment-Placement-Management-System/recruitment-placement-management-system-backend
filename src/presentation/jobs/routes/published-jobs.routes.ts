import { Router } from "express";
import type { PublishedJobsControllerDependencies } from "../controllers/published-jobs.controller.js";
import { createPublishedJobsController } from "../controllers/published-jobs.controller.js";

export const createPublishedJobsRouter = (dependencies: PublishedJobsControllerDependencies) => {
  const router = Router();
  const controller = createPublishedJobsController(dependencies);
  router.get("/", controller.search);
  router.get("/:jobId", controller.get);
  return router;
};
