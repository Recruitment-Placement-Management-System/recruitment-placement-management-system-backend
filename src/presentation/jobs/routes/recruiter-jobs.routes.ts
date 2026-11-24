import { Router } from "express";
import type { RecruiterJobsControllerDependencies } from "../controllers/recruiter-jobs.controller.js";
import { createRecruiterJobsController } from "../controllers/recruiter-jobs.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";
import { createJobSchema, updateJobSchema } from "../validators/job.validator.js";

export const createRecruiterJobsRouter = (dependencies: RecruiterJobsControllerDependencies) => {
  const router = Router();
  const controller = createRecruiterJobsController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("recruiter"));

  router.post("/", validate(createJobSchema), controller.create);
  router.get("/", controller.list);
  router.get("/:jobId", controller.get);
  router.patch("/:jobId", validate(updateJobSchema), controller.update);
  router.delete("/:jobId", controller.delete);
  router.patch("/:jobId/publish", controller.publish);
  router.patch("/:jobId/unpublish", controller.unpublish);
  return router;
};
