import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../application/errors/app-error.js";
import { HttpStatus } from "../../shared/constants/http-status.js";

export const authorize = (...allowedRoles: string[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication required");
      }

      const hasRole = req.user.roles.some((role) =>
        allowedRoles.includes(role),
      );

      if (!hasRole) {
        throw new AppError(HttpStatus.FORBIDDEN, "You are not authorized");
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};
