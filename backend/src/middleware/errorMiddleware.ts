import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../enums/httpStatus.enums";
import logger from "../utils/logger";

interface CustomError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  logger.error(err.message, {
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    body: req.body ? { ...req.body, password: undefined } : undefined,
    query: req.query,
    params: req.params,
  });

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${status} - ${err.message}`);
  }

  if (res.headersSent) {
    return;
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

