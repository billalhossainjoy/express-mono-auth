import { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/HttpError";
import { NODE_ENV } from "../config/env/app.env";
import { logger } from "../config/logger";
import { ZodError } from "zod";
import { ResponseApi } from "../lib/ResponseApi";
import { Prisma } from "@prisma/client";

export function DefaultErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.status;
    message = err.message;
  } else if (NODE_ENV !== "production") {
    message = err.message;
  }

  logger.error({
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
    message: err.message,
  });

  if (err instanceof ZodError) {
    return ResponseApi(res, statusCode, "Validation Failed", {
      errors: err._zod,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return ResponseApi(res, statusCode, "Validation Failed", {
      errors: err,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
