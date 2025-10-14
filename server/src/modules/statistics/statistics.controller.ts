import { asyncHandler } from "../../lib/AsyncHandler";
import { StatisticsService } from "./statistics.service";
import { ResponseApi } from "../../lib/ResponseApi";

export class StatisticsController {
  airlinesOverview = asyncHandler(async (req, res) => {
    const month = req.query.month ? Number(req.query.month) : undefined;
    const year = req.query.year ? Number(req.query.year) : undefined;

    const data = await StatisticsService.airlinesOverview(month, year);
    return ResponseApi(res, 200, "Airlines Overview", data);
  });

  byPassRate() {}
  bySubmissions() {}
}
