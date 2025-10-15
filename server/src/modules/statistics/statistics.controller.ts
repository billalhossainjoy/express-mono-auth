import { asyncHandler } from "../../lib/AsyncHandler";
import { StatisticsService } from "./statistics.service";
import { ResponseApi } from "../../lib/ResponseApi";
import { StatisticsSchema } from "./statistics.schema";
import { z } from "zod";

export class StatisticsController {
  getStatistics = asyncHandler(async (req, res) => {
    const data = await StatisticsService.getStatistics();
    return ResponseApi(res, 200, "Airlines Overview", data);
  });

  airlinesOverview = asyncHandler(async (req, res) => {
    const data = StatisticsSchema.parse(req.query);

    const response = await StatisticsService.airlinesOverview(data);
    return ResponseApi(res, 200, "Airlines Overview", response);
  });

  byPassRate = asyncHandler(async (req, res) => {
    const date = z
      .string()
      .transform((v) => new Date(v))
      .parse(req.query.date);

    const response = await StatisticsService.byPassRate(date);
    return ResponseApi(res, 200, "Airlines by pass rate", response);
  });

  bySubmissions = asyncHandler(async (req, res) => {
    const date = z
      .string()
      .transform((v) => new Date(v))
      .parse(req.query.date);

    const response = await StatisticsService.bySubmissions(date);
    return ResponseApi(res, 200, "Airlines by pass rate", response);
  });
}
