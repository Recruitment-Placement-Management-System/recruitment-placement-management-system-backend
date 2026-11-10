import { Router } from "express";
import { createCandidateProfileController, type CandidateProfileControllerDependencies } from "../controllers/candidate-profile.controller.js";
import {
  addCandidateSkillsSchema,
  createCandidateProfileSchema,
  removeCandidateSkillSchema,
  updateCandidatePersonalInformationSchema,
  updateCandidateProfileSchema,
  updateCandidateSkillSchema,
} from "../validators/candidate-profile.validator.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";

export const createCandidateProfileRouter = (dependencies: CandidateProfileControllerDependencies) => {
  const router = Router();
  const controller = createCandidateProfileController(dependencies);
  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));
  
  router.post("/", validate(createCandidateProfileSchema), controller.create);
  router.get("/", controller.get);
  router.patch("/", validate(updateCandidateProfileSchema), controller.update);

  router.patch("/personal-information", validate(updateCandidatePersonalInformationSchema), controller.updatePersonalInformation);
  
  router.post("/skills", validate(addCandidateSkillsSchema), controller.addSkills);
  router.put("/skills", validate(updateCandidateSkillSchema), controller.updateSkill);
  router.delete("/skills", validate(removeCandidateSkillSchema), controller.removeSkill);

  return router;
};
