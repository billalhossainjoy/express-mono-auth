import express, { Router } from "express";
import { PaymentController } from "./payment.controller";

class PaymentRoute {
  readonly router = Router();

  constructor(private readonly controller = new PaymentController()) {
    this.router.route("/create-payment").post(controller.createPaymentSession);

    this.router
      .route("/webhook")
      .post(express.raw({ type: "application/json" }), controller.webhook);
  }
}

export const PaymentRouter = new PaymentRoute().router;
