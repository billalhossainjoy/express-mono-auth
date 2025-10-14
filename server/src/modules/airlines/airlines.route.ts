import { Router } from "express";
import { AirlinesController } from "./airlines.controller";

export class AirlinesRoute {
  readonly router = Router();

  constructor(private readonly controller = new AirlinesController()) {
    this.router.route("/").get(controller.getAll).post(controller.create);

    this.router.route("/search").get(controller.search);

    this.router
      .route("/:id")
      .get(controller.getById)
      .patch(controller.update)
      .delete(controller.delete);
  }
}

export const AirlinesRouter = new AirlinesRoute().router;
