import { asyncHandler } from "../../lib/AsyncHandler";
import { ResponseApi } from "../../lib/ResponseApi";

import { AirlinesService } from "./airlines.service";
import { CreateAirlinesSchema, UpdateAirlinesSchema } from "./airlines.schema";

export class AirlinesController {
  getAll = asyncHandler(async (req, res) => {
    const airlines = await AirlinesService.getAllAirlines();
    return ResponseApi(res, 200, "All Airlines", airlines);
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const airline = await AirlinesService.getAirlineById(id);
    return ResponseApi(res, 200, "Airline Details", airline);
  });

  create = asyncHandler(async (req, res) => {
    const body = CreateAirlinesSchema.parse(req.body);
    const airline = await AirlinesService.createAirline(body.name);
    return ResponseApi(res, 201, "Airline Created", airline);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = UpdateAirlinesSchema.parse(req.body);
    const airline = await AirlinesService.updateAirline(id, body.name);
    return ResponseApi(res, 200, "Airline Updated", airline);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AirlinesService.deleteAirline(id);
    return ResponseApi(res, 200, "Airline Deleted");
  });

  search = asyncHandler(async (req, res) => {
    const { airline: query } = req.query;
    const assessments = await AirlinesService.searchAirlines(query as string);
    return ResponseApi(res, 200, "Search Results", assessments);
  });
}
