import { NextFunction, Request, Response } from "express";

// Http error
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler
export const NotFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new HttpError(404, "Not Found"));
};
