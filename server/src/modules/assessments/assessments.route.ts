import { Router } from "express";
import { AssessmentsController } from "./assessments.controller";

export class AssessmentsRoute {
  readonly router = Router();

  constructor(private readonly controller = new AssessmentsController()) {
    this.router.route("/").get(controller.getAll).post(controller.create);

    this.router.route("/search").get(controller.search);

    this.router
      .route("/:id")
      .get(controller.getById)
      .patch(controller.update)
      .delete(controller.delete);
  }
}

export const AssessmentsRouter = new AssessmentsRoute().router;
