import { Router } from "express";
import { StatisticsController } from "./statistics.controller";

export class StatisticsRoute {
  readonly router = Router();

  constructor(private readonly controller = new StatisticsController()) {
    this.router.route("/airlines-overview").get(controller.airlinesOverview);
    this.router.route("/top-airlines-pass-rate").get(controller.byPassRate);
    this.router.route("/top-airlines-submission").get(controller.bySubmissions);
  }
}

export const StatisticsRouter = new StatisticsRoute().router;
