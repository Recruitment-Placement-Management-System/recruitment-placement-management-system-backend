import type { RequestHandler } from "express";
import type { AdminControllerDependencies } from "../admin.dependencies.js";
import { AppError } from "../../../application/errors/app-error.js";

export const createAdminUsersController = (dependencies: AdminControllerDependencies): RequestHandler =>
  (req, res, next) => {
    Promise.resolve().then(async () => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new AppError(400, "Page must be a positive integer and limit must be between 1 and 100", "INVALID_PAGINATION");
      }

      const result = await dependencies.listUsersUseCase.execute({ page, limit });
      const users = result.users.map((user) => ({
        id: user.id, fullName: user.fullName, email: user.email,
        roles: user.roles, status: user.status, isEmailVerified: user.isEmailVerified,
        phone: user.phone, lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt, updatedAt: user.updatedAt,
      }));

      res.status(200).json({
        message: "Users retrieved successfully", users,
        pagination: { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
      });
    }).catch(next);
  };
