import { asyncHandler } from "../../../lib/AsyncHandler";
import { HttpError } from "../../../lib/HttpError";
import { Role as RoleTypes } from "@prisma/client";

export const Role = (role: RoleTypes, ...others: RoleTypes[]) =>
  asyncHandler((req, res, next) => {
    const roles = [role, ...others];

    if (!roles.includes(req.user.role as RoleTypes)) {
      throw new HttpError(
        401,
        "You do not have permission to access this route.",
      );
    }

    next();
  });
