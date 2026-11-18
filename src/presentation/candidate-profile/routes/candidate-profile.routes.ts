import { Router } from "express";
import { createCandidateProfileController, type CandidateProfileControllerDependencies } from "../controllers/candidate-profile.controller.js";
import {
  addCandidateSkillsSchema,
  addCandidateEducationSchema,
  addCandidateExperienceSchema,
  addCandidateProjectSchema,
  addCandidateCertificationSchema,
  addCandidateLanguageSchema,
  createCandidateProfileSchema,
  removeCandidateSkillSchema,
  deleteCandidateEducationSchema,
  deleteCandidateExperienceSchema,
  deleteCandidateProjectSchema,
  deleteCandidateCertificationSchema,
  removeCandidateLanguageSchema,
  updateCandidatePersonalInformationSchema,
  updateCandidateProfileSchema,
  updateCandidateSkillSchema,
  updateCandidateEducationSchema,
  updateCandidateExperienceSchema,
  updateCandidateProjectSchema,
  updateCandidateCertificationSchema,
  updateCandidateLanguageProficiencySchema,
} from "../validators/candidate-profile.validator.js";
import { createAuthenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validate.js";
import { uploadCandidateProfilePhoto } from "../middleware/candidate-profile-photo-upload.middleware.js";
import { uploadCandidateResume } from "../middleware/candidate-resume-upload.middleware.js";

export const createCandidateProfileRouter = (dependencies: CandidateProfileControllerDependencies) => {
  const router = Router();
  const controller = createCandidateProfileController(dependencies);
  router.use(createAuthenticate(dependencies.tokenService), authorize("candidate"));
  
  router.post("/", validate(createCandidateProfileSchema), controller.create);
  router.get("/", controller.get);
  router.patch("/", validate(updateCandidateProfileSchema), controller.update);

  router.post("/photo", uploadCandidateProfilePhoto, controller.uploadProfilePhoto);
  router.delete("/photo", controller.deleteProfilePhoto);

  router.post("/resume", uploadCandidateResume, controller.uploadResume);
  router.get("/resume", controller.getResume);
  router.delete("/resume", controller.deleteResume);

  router.patch("/personal-information", validate(updateCandidatePersonalInformationSchema), controller.updatePersonalInformation);
  
  router.post("/skills", validate(addCandidateSkillsSchema), controller.addSkills);
  router.put("/skills", validate(updateCandidateSkillSchema), controller.updateSkill);
  router.delete("/skills", validate(removeCandidateSkillSchema), controller.removeSkill);
  
  router.post("/education", validate(addCandidateEducationSchema), controller.addEducation);
  router.patch("/education", validate(updateCandidateEducationSchema), controller.updateEducation);
  router.delete("/education", validate(deleteCandidateEducationSchema), controller.deleteEducation);

  router.post("/experience", validate(addCandidateExperienceSchema), controller.addExperience);
  router.patch("/experience", validate(updateCandidateExperienceSchema), controller.updateExperience);
  router.delete("/experience", validate(deleteCandidateExperienceSchema), controller.deleteExperience);

  router.post("/projects", validate(addCandidateProjectSchema), controller.addProject);
  router.patch("/projects", validate(updateCandidateProjectSchema), controller.updateProject);
  router.delete("/projects", validate(deleteCandidateProjectSchema), controller.deleteProject);

  router.post("/certifications", validate(addCandidateCertificationSchema), controller.addCertification);
  router.patch("/certifications", validate(updateCandidateCertificationSchema), controller.updateCertification);
  router.delete("/certifications", validate(deleteCandidateCertificationSchema), controller.deleteCertification);

  router.post("/languages", validate(addCandidateLanguageSchema), controller.addLanguage);
  router.patch("/languages", validate(updateCandidateLanguageProficiencySchema), controller.updateLanguageProficiency);
  router.delete("/languages", validate(removeCandidateLanguageSchema), controller.removeLanguage);

  return router;
};
