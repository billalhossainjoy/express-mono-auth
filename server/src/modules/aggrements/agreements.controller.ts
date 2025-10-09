import { asyncHandler } from "../../lib/AsyncHandler";
import {
  AgreementsSchema,
  CreateAgreementsSchema,
  UpdateAgreementsSchema,
} from "./schema/agreements.schema";
import { AgreementsService } from "./agreements.services";
import { ResponseApi } from "../../lib/ResponseApi";

export class AgreementsController {
  get = asyncHandler(async (req, res, next) => {
    const body = AgreementsSchema.parse(req.body);

    const agreement = await AgreementsService.get(body);
    return ResponseApi(res, 200, "Agreements", agreement);
  });

  create = asyncHandler(async (req, res, next) => {
    const body = CreateAgreementsSchema.parse(req.body);

    const agreement = await AgreementsService.create(body);
    return ResponseApi(res, 200, "Agreements", agreement);
  });

  update = asyncHandler(async (req, res) => {
    const body = UpdateAgreementsSchema.parse(req.body);
    const { id } = req.params;

    const agreement = await AgreementsService.update(id, body);
    return ResponseApi(res, 200, "Agreements", agreement);
  });
}
