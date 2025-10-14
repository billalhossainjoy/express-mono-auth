import { Router } from "express";
import { SubmissionController } from "./submission.controller";

export class SubmissionRoute {
  readonly router = Router();

  constructor(private readonly controller = new SubmissionController()) {
    this.router.route("/").get(controller.getAll);
    this.router.route("/").post(controller.create);
    this.router.route("/:id").get(controller.getById);
    this.router.route("/:id").patch(controller.update);
    this.router.route("/:id").delete(controller.delete);
  }
}

export const SubmissionRouter = new SubmissionRoute().router;
