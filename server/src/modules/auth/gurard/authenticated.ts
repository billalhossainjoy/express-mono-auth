import { Protected } from "./protected";
import { asyncHandler } from "../../../lib/AsyncHandler";

export const Authenticate = [
  Protected,
  asyncHandler((req, res, next) => {
    if (!req.account.isVerified) throw new Error("Account is not verified");
    next();
  }),
];
