import { Router } from "express";
import type { RecruiterVerificationControllerDependencies } from "../controllers/recruiter-verification.controller.js";
import { createRecruiterVerificationController } from "../controllers/recruiter-verification.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { uploadRecruiterVerificationDocuments } from "../middleware/recruiter-verification-upload.middleware.js";

export const createRecruiterVerificationRouter = (dependencies: RecruiterVerificationControllerDependencies) => {
  const router = Router();
  const controller = createRecruiterVerificationController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("recruiter"));
  
  router.post("/", uploadRecruiterVerificationDocuments, controller.submit);
  router.get("/history", controller.history);
  return router;
};
