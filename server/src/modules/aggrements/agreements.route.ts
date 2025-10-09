import { Router } from "express";
import { AgreementsController } from "./agreements.controller";
import { Authenticate } from "../auth/gurard/authenticated";

class AgreementsRoute {
  readonly router = Router();

  constructor(private readonly controller = new AgreementsController()) {
    this.router.route("/").get(Authenticate, controller.get);
    this.router.route("/").post(Authenticate, controller.create);
    this.router.route("/:id").put(Authenticate, controller.update);
  }
}

export const AgreementsRouter = new AgreementsRoute().router;
