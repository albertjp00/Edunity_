import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums/httpStatus.enums";
import logger from "../utils/logger";

interface CustomError extends Error {
  statusCode?: number;
}



export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  // Correct way to log an error object
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

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

