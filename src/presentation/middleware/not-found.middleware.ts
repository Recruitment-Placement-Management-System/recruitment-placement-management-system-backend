import type { Request, Response } from "express";
import { HttpStatus } from "../../shared/constants/http-status.js";

export const notFoundMiddleware = (
  _req: Request,
  res: Response,
): void => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: {
      code: "ROUTE_NOT_FOUND",
    },
  });
};

