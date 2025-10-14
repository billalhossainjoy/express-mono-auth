import { Router } from "express";
import { AuthController } from "./auth.controller";
import { Protected } from "./gurard/protected";

class AuthRoute {
  readonly router = Router();

  constructor(private readonly controller = new AuthController()) {
    this.router.route("/signup").post(controller.signup);
    this.router.route("/login").post(controller.login);
    this.router.route("/refresh-token").get(controller.refreshToken);

    this.router.route("/verify-otp").post(Protected, controller.verifyOtp);
    this.router
      .route("/verify/:token")
      .get(Protected, controller.verifyByToken);

    this.router.route("/forgot-password").post(controller.forgotPassword);
    this.router.route("/forgot-password/otp").post(controller.forgotByOtp);
    this.router.route("/reset-password").post(controller.resetPasswordByOtp);
    this.router
      .route("/reset-password/:token")
      .post(controller.resetPasswordByToken);

    this.router.route("/logout").get(Protected, controller.logout);
    this.router.route("/session").get(Protected, controller.getSession);
  }
}

export const AuthRouter = new AuthRoute().router;
