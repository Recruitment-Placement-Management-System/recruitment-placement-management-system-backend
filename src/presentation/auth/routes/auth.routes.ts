import { Router } from "express";
import { createAuthController, type AuthControllerDependencies } from "../controllers/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import {
  forgotPasswordSchema, loginSchema, registerCandidateSchema,
  registerRecruiterSchema, resendVerificationEmailSchema, changeVerificationEmailSchema,
  resetPasswordSchema, verifyEmailSchema,
} from "../validators/auth.validator.js";

export const createAuthRouter = (dependencies: AuthControllerDependencies) => {
  const router = Router();
  const controller = createAuthController(dependencies);

  router.post("/register", validate(registerCandidateSchema), controller.registerCandidate);
  router.post("/verify-email", validate(verifyEmailSchema), controller.verifyEmail);
  router.post("/resend-verification", validate(resendVerificationEmailSchema), controller.resendVerificationEmail);
  router.post("/change-verification-email", validate(changeVerificationEmailSchema), controller.changeVerificationEmail);
  router.post("/register/recruiter", validate(registerRecruiterSchema), controller.registerRecruiter);
  router.post("/login", validate(loginSchema), controller.login);
  router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);
  router.post("/reset-password", validate(resetPasswordSchema), controller.resetPassword);
  router.post("/refresh-token", controller.refreshAccessToken);
  router.post("/logout", controller.logout);

  return router;
};
