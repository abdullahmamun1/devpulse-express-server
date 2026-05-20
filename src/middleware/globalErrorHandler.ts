import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  if (typeof err === "object" && err !== null && "statusCode" in err) {
    statusCode = Number(err.statusCode);
  }
  res.status(statusCode).json({
    success: false,
    message,
    errors: err,
  });
};
