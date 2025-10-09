import pinoHttp, { HttpLogger } from "pino-http";
import { logger } from "../config/logger";
import { IncomingMessage, ServerResponse } from "node:http";

export const httpLogger: HttpLogger = pinoHttp<IncomingMessage, ServerResponse>(
  {
    logger,
    customProps: (req) => ({
      requestId: req.id,
    }),
    customLogLevel: (_req, res, err) => {
      if (err) return "error";

      // Then check status codes
      const statusCode = res.statusCode;
      if (statusCode >= 500) return "error";
      if (statusCode >= 400) return "warn";

      return "info";
    },
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  },
);
