import { asyncHandler } from "../../lib/AsyncHandler";
import { ResponseApi } from "../../lib/ResponseApi";
import { updateUserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { updatePasswordSchema } from "../account/schema/account.schema";
import { HttpError } from "../../lib/HttpError";
import { AccountService } from "../account/account.service";

export class UserController {
  getUser = asyncHandler(async (req, res, next) => {
    return ResponseApi(res, 200, "User", {
      ...req.user,
    });
  });

  updateUser = asyncHandler(async (req, res, next) => {
    const data = updateUserSchema.parse(req.body);
    const account = await UserService.update(req.user.id, data);

    return ResponseApi(res, 200, "User updated", account);
  });

  updatePassword = asyncHandler(async (req, res, next) => {
    const updates = updatePasswordSchema.parse(req.body);
    await AccountService.updatePassword(
      req.account.id,
      req.account.password,
      updates,
    );
    return ResponseApi(res, 200, "password updated", {});
  });

  updateAvatar = asyncHandler(async (req, res, next) => {
    if (!req.file) throw new HttpError(400, "An image required");
    const updates = await UserService.uploadAvatar(req.user.id, req.file);

    return ResponseApi(res, 201, "Avatar updated", {
      avatar: updates.secure_url,
    });
  });
}
