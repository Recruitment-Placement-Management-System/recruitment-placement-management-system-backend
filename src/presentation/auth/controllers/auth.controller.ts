import type { RequestHandler } from "express";
import type { RegisterCandidateUseCase } from "../../../application/use-cases/auth/register-candidate.use-case.js";
import type { VerifyEmailUseCase } from "../../../application/use-cases/auth/verify-email.use-case.js";
import type { ResendVerificationEmailUseCase } from "../../../application/use-cases/auth/resend-verification-email.use-case.js";
import type { ChangeVerificationEmailUseCase } from "../../../application/use-cases/auth/change-verification-email.use-case.js";
import type { RegisterRecruiterUseCase } from "../../../application/use-cases/auth/register-recruiter.use-case.js";
import type { LoginUseCase } from "../../../application/use-cases/auth/login.use-case.js";
import type { ForgotPasswordUseCase } from "../../../application/use-cases/auth/forgot-password.use-case.js";
import type { ResetPasswordUseCase } from "../../../application/use-cases/auth/reset-password.use-case.js";
import type { RefreshAccessTokenUseCase } from "../../../application/use-cases/auth/refresh-access-token.use-case.js";
import type { LogoutUseCase } from "../../../application/use-cases/auth/logout.use-case.js";
import { AppError } from "../../../application/errors/app-error.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../auth-cookie.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface AuthControllerDependencies {
  registerCandidateUseCase: RegisterCandidateUseCase;
  verifyEmailUseCase: VerifyEmailUseCase;
  resendVerificationEmailUseCase: ResendVerificationEmailUseCase;
  changeVerificationEmailUseCase: ChangeVerificationEmailUseCase;
  registerRecruiterUseCase: RegisterRecruiterUseCase;
  loginUseCase: LoginUseCase;
  forgotPasswordUseCase: ForgotPasswordUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
  refreshAccessTokenUseCase: RefreshAccessTokenUseCase;
  logoutUseCase: LogoutUseCase;
}

export const createAuthController = (dependencies: AuthControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    registerCandidate: wrap(async (req, res) => {
      const user = await dependencies.registerCandidateUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        message: "Registration successful. Please verify your email.",
        user: {
          id: user.id, fullName: user.fullName, email: user.email,
          roles: user.roles, status: user.status, isEmailVerified: user.isEmailVerified,
          phone: user.phone, createdAt: user.createdAt,
        },
      });
    }),

    verifyEmail: wrap(async (req, res) => {
      await dependencies.verifyEmailUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({ message: "Email verified successfully" });
    }),

    resendVerificationEmail: wrap(async (req, res) => {
      await dependencies.resendVerificationEmailUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({
        message: "If the account requires email verification, a verification email has been sent.",
      });
    }),

    changeVerificationEmail: wrap(async (req, res) => {
      await dependencies.changeVerificationEmailUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({ message: "Verification code sent to the updated email address." });
    }),

    registerRecruiter: wrap(async (req, res) => {
      const recruiter = await dependencies.registerRecruiterUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        message: "Recruiter registered successfully. Please verify your email",
        userId: recruiter.id,
      });
    }),

    login: wrap(async (req, res) => {
      const result = await dependencies.loginUseCase.execute(req.body, ["candidate", "recruiter"]);
      setRefreshTokenCookie(res, result.refreshToken);
      res.status(HttpStatus.OK).json({ message: "Login successful", accessToken: result.accessToken, user: result.user });
    }),

    forgotPassword: wrap(async (req, res) => {
      await dependencies.forgotPasswordUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({ message: "If an account with that email exists, a password reset link has been sent" });
    }),

    resetPassword: wrap(async (req, res) => {
      await dependencies.resetPasswordUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({ message: "Password has been reset successfully" });
    }),

    refreshAccessToken: wrap(async (req, res) => {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new AppError(HttpStatus.UNAUTHORIZED, "Refresh token not found", "REFRESH_TOKEN_NOT_FOUND");
      const result = await dependencies.refreshAccessTokenUseCase.execute({ refreshToken });
      res.status(HttpStatus.OK).json({ accessToken: result.accessToken, user: result.user });
    }),

    logout: wrap(async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new AppError(HttpStatus.UNAUTHORIZED, "Refresh token not found", "REFRESH_TOKEN_NOT_FOUND");
        await dependencies.logoutUseCase.execute({ refreshToken });
        res.status(HttpStatus.OK).json({ message: "Logout successful" });
      } finally {
        clearRefreshTokenCookie(res);
      }
    }),
  };
};
