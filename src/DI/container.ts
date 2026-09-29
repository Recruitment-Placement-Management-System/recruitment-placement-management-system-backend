import { RegisterCandidateUseCase } from '../application/use-cases/auth/register-candidate.use-case.js';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case.js';
import { ResendVerificationEmailUseCase } from '../application/use-cases/auth/resend-verification-email.use-case.js';

import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";
import { Argon2PasswordService } from "../infrastructure/services/argon2-password.service.js";
import { ResendEmailService } from "../infrastructure/services/resend-email.service.js";

const userRepository = new MongoUserRepository();
const passwordService = new Argon2PasswordService();
const emailService = new ResendEmailService();

export const registerCandidateUseCase = new RegisterCandidateUseCase(
    userRepository,
    passwordService,
    emailService,
  );

export const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  passwordService,
);

export const resendVerificationEmailUseCase = new ResendVerificationEmailUseCase(
  userRepository,
  passwordService,
  emailService,
);