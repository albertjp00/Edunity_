import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums/httpStatus.enums.js";

interface CustomError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = HttpStatus.INTERNAL_SERVER_ERROR;

  console.error(`[ERROR] ${status} - ${err.message}`);

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
