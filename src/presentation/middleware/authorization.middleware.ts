import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/app-error.js";

export const authorize = (...allowedRoles: string[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new AppError(401, "Authentication required");
      }

      const hasRole = req.user.roles.some((role) =>
        allowedRoles.includes(role),
      );

      if (!hasRole) {
        throw new AppError(403, "You are not authorized");
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};