import { Router } from "express";
import { UserController } from "./user.controller";
import { upload } from "../../lib/multer";
import { Protected } from "../auth/gurard/protected";

export class UserRoute {
  readonly router = Router();

  constructor(private readonly controller = new UserController()) {
    this.router
      .route("/")
      .get(Protected, controller.getUser)
      .patch(Protected, controller.updateUser);
    this.router
      .route("/change-password")
      .patch(Protected, controller.updatePassword);
    this.router
      .route("/avatar")
      .put(Protected, upload.single("avatar"), controller.updateAvatar);
  }
}

export const UserRouter = new UserRoute().router;
