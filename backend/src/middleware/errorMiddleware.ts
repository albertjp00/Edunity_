import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || 500;

  console.error(`[ERROR] ${status} - ${err.message}`);

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
