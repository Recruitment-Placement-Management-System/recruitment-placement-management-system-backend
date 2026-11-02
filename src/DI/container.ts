import { RegisterCandidateUseCase } from '../application/use-cases/auth/register-candidate.use-case.js';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case.js';
import { ResendVerificationEmailUseCase } from '../application/use-cases/auth/resend-verification-email.use-case.js';
import { ChangeVerificationEmailUseCase } from '../application/use-cases/auth/change-verification-email.use-case.js';
import { RegisterRecruiterUseCase } from '../application/use-cases/auth/register-recruiter.use-case.js';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case.js';
import { ForgotPasswordUseCase } from '../application/use-cases/auth/forgot-password.use-case.js';
import { ResetPasswordUseCase } from '../application/use-cases/auth/reset-password.use-case.js';
import { RefreshAccessTokenUseCase } from '../application/use-cases/auth/refresh-access-token.use-case.js';
import { LogoutUseCase } from '../application/use-cases/auth/logout.use-case.js';
import { ListUsersUseCase } from '../application/use-cases/admin/list-users.use-case.js';

import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";
import { Argon2PasswordService } from "../infrastructure/services/argon2-password.service.js";
import { NodemailerEmailService } from '../infrastructure/services/nodemailer-email.service.js';
import { MongoCompanyRepository } from '../infrastructure/repositories/mongo-company.repository.js';
import { MongoRecruiterProfileRepository } from '../infrastructure/repositories/mongo-recruiter-profile.repository.js';
import { MongoVerificationRequestRepository } from '../infrastructure/repositories/mongo-verification-request.repository.js';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service.js';

const userRepository = new MongoUserRepository();
const passwordService = new Argon2PasswordService();
const emailService = new NodemailerEmailService();
const companyRepository = new MongoCompanyRepository();
const recruiterProfileRepository = new MongoRecruiterProfileRepository();
const verificationRequestRepository = new MongoVerificationRequestRepository()
export const tokenService = new JwtTokenService()

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

export const changeVerificationEmailUseCase = new ChangeVerificationEmailUseCase(
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

export const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  tokenService
);

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepository,
  emailService
);

export const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordService,
);

export const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
  userRepository,
  passwordService,
  tokenService,
);

export const logoutUseCase = new LogoutUseCase(
  userRepository,
  passwordService,
  tokenService,
);

export const authDependencies = {
  registerCandidateUseCase,
  verifyEmailUseCase,
  resendVerificationEmailUseCase,
  changeVerificationEmailUseCase,
  registerRecruiterUseCase,
  loginUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  refreshAccessTokenUseCase,
  logoutUseCase,
};

export const listUsersUseCase = new ListUsersUseCase(userRepository);
export const adminDependencies = { loginUseCase, listUsersUseCase, tokenService };
