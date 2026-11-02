import type { RequestHandler } from "express";
import type { AdminControllerDependencies } from "../admin.dependencies.js";
import { setRefreshTokenCookie } from "../../auth/auth-cookie.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export const createAdminLoginController = (dependencies: AdminControllerDependencies): RequestHandler =>
  (req, res, next) => {
    Promise.resolve().then(async () => {
      const result = await dependencies.loginUseCase.execute(req.body, ["admin"]);
      setRefreshTokenCookie(res, result.refreshToken);
      res.status(HttpStatus.OK).json({ message: "Admin login successful", accessToken: result.accessToken, user: result.user });
    }).catch(next);
  };
