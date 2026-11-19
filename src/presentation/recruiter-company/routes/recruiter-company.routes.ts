import { Router } from "express";
import type { RecruiterCompanyControllerDependencies } from "../controllers/recruiter-company.controller.js";
import { createRecruiterCompanyController } from "../controllers/recruiter-company.controller.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";
import { updateRecruiterCompanySchema } from "../validators/recruiter-company.validator.js";

export const createRecruiterCompanyRouter = (dependencies: RecruiterCompanyControllerDependencies) => {
  const router = Router();
  const controller = createRecruiterCompanyController(dependencies);

  router.use(createAuthenticate(dependencies.tokenService), authorize("recruiter"));
  
  router.get("/", controller.get);
  router.patch("/", validate(updateRecruiterCompanySchema), controller.update);
  return router;
};
