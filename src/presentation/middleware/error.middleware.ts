import type { ErrorRequestHandler } from "express";
import { AppError } from "../../application/errors/app-error.js";
import { HttpStatus } from "../../shared/constants/http-status.js";

export interface ErrorLogger {
  error(error: unknown): void;
}

export const createErrorMiddleware = (logger: ErrorLogger): ErrorRequestHandler =>
  (error: unknown, _req, res, _next): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: { code: error.code },
      });
      return;
    }

    logger.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_SERVER_ERROR" },
    });
  };
