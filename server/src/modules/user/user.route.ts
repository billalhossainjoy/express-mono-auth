import { Router } from "express";
import { UserController } from "./user.controller";
import { Authenticate } from "../auth/gurard/authenticated";
import { upload } from "../../lib/multer";

export class UserRoute {
  readonly router = Router();

  constructor(private readonly controller = new UserController()) {
    this.router.route("/").get(Authenticate, controller.getUser);
    this.router.route("/").post(Authenticate, controller.updateUser);
    this.router
      .route("/change-password")
      .post(Authenticate, controller.updatePassword);
    this.router
      .route("/avatar")
      .post(Authenticate, upload.single("avatar"), controller.updateAvatar);
  }
}

export const UserRouter = new UserRoute().router;
