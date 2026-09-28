import { RegisterCandidateUseCase } from '../application/use-cases/auth/register-candidate.use-case.js';

import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";
import { Argon2PasswordService } from "../infrastructure/services/argon2-password.service.js";
import { ResendEmailService } from "../infrastructure/services/resend-email.service.js";

const userRepository = new MongoUserRepository();
const passwordService = new Argon2PasswordService();
const emailService = new ResendEmailService();

export const registerCandidateUseCase =
  new RegisterCandidateUseCase(
    userRepository,
    passwordService,
    emailService,
  );