import type { NextFunction, Request, Response } from "express";

import { logger } from "../../infrastructure/logger/logger.js";
import { AppError } from "../../shared/errors/app-error.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
      },
    });

    return;
  }

  logger.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};