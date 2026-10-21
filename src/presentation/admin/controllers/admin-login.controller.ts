import type { RequestHandler } from "express";
import type { AdminControllerDependencies } from "../admin.dependencies.js";
import { AppError } from "../../../application/errors/app-error.js";
import { setRefreshTokenCookie } from "../../auth/auth-cookie.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export const createAdminLoginController = (dependencies: AdminControllerDependencies): RequestHandler =>
  (req, res, next) => {
    Promise.resolve().then(async () => {
      const result = await dependencies.loginUseCase.execute(req.body);
      if (!result.user.roles.includes("admin")) throw new AppError(HttpStatus.FORBIDDEN, "Admin access required");
      setRefreshTokenCookie(res, result.refreshToken);
      res.status(HttpStatus.OK).json({ message: "Admin login successful", accessToken: result.accessToken, user: result.user });
    }).catch(next);
  };
