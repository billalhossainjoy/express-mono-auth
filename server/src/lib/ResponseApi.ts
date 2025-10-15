import { Response } from "express";

export const ResponseApi = (
  res: Response,
  status: number,
  message: string,
  data?: object,
  optional: object = {},
) => {
  return res.status(status).json({
    success: true,
    statusCode: status,
    message,
    data,
    ...optional,
  });
};
