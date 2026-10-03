import { RegisterCandidateUseCase } from '../application/use-cases/auth/register-candidate.use-case.js';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case.js';
import { ResendVerificationEmailUseCase } from '../application/use-cases/auth/resend-verification-email.use-case.js';
import { RegisterRecruiterUseCase } from '../application/use-cases/auth/register-recruiter.use-case.js';

import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";
import { Argon2PasswordService } from "../infrastructure/services/argon2-password.service.js";
import { NodemailerEmailService } from '../infrastructure/services/nodemailer-email.service.js';
import { MongoCompanyRepository } from '../infrastructure/repositories/mongo-company.repository.js';
import { MongoRecruiterProfileRepository } from '../infrastructure/repositories/mongo-recruiter-profile.repository.js';
import { MongoVerificationRequestRepository } from '../infrastructure/repositories/mongo-verification-request.repository.js';

const userRepository = new MongoUserRepository();
const passwordService = new Argon2PasswordService();
const emailService = new NodemailerEmailService();
const companyRepository = new MongoCompanyRepository();
const recruiterProfileRepository = new MongoRecruiterProfileRepository();
const verificationRequestRepository = new MongoVerificationRequestRepository()

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

export const registerRecruiterUseCase = new RegisterRecruiterUseCase(
  userRepository,
  companyRepository,
  recruiterProfileRepository,
  verificationRequestRepository,
  passwordService,
  emailService,
);