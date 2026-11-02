import type { RequestHandler } from "express";
import type { AdminControllerDependencies } from "../admin.dependencies.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export const createAdminUsersController = (dependencies: AdminControllerDependencies): RequestHandler =>
  (req, res, next) => {
    Promise.resolve().then(async () => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const requestedSortBy = String(req.query.sortBy ?? "createdAt").toLowerCase();
      const sortOrder = String(req.query.sortOrder ?? req.query.sorts ?? "asc").toLowerCase();
      const search = String(req.query.search ?? "").trim();
      if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Page must be a positive integer and limit must be between 1 and 100", "INVALID_PAGINATION");
      }
      const sortFieldAliases = {
        createdat: "createdAt",
        date: "createdAt",
        fullname: "fullName",
        name: "fullName",
        email: "email",
      } as const;
      if (!Object.prototype.hasOwnProperty.call(sortFieldAliases, requestedSortBy)) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Sort field must be one of: createdAt, fullName, email", "INVALID_SORT_FIELD");
      }
      if (sortOrder !== "asc" && sortOrder !== "desc") {
        throw new AppError(HttpStatus.BAD_REQUEST, "Sort order must be either 'asc' or 'desc'", "INVALID_SORT_ORDER");
      }

      const result = await dependencies.listUsersUseCase.execute({
        page,
        limit,
        sortBy: sortFieldAliases[requestedSortBy as keyof typeof sortFieldAliases],
        sortOrder,
        ...(search ? { search } : {}),
      });
      const users = result.users.map((user) => ({
        id: user.id, fullName: user.fullName, email: user.email,
        roles: user.roles, status: user.status, isEmailVerified: user.isEmailVerified,
        phone: user.phone, lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt, updatedAt: user.updatedAt,
      }));

      res.status(HttpStatus.OK).json({
        message: "Users retrieved successfully", users,
        pagination: { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
      });
    }).catch(next);
  };
