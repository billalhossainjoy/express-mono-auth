import { asyncHandler } from "../../lib/AsyncHandler";
import { ResponseApi } from "../../lib/ResponseApi";
import { AssessmentsService } from "./assessments.service";
import {
  CreateAssessmentsSchema,
  UpdateAssessmentsSchema,
} from "./assessments.schema";

export class AssessmentsController {
  getAll = asyncHandler(async (req, res) => {
    const assessments = await AssessmentsService.getAllAssessments();
    return ResponseApi(res, 200, "All Assessments", assessments);
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const assessment = await AssessmentsService.getAssessmentById(id);
    return ResponseApi(res, 200, "Assessment Details", assessment);
  });

  create = asyncHandler(async (req, res) => {
    const body = CreateAssessmentsSchema.parse(req.body);
    const assessment = await AssessmentsService.createAssessment(body.name);
    return ResponseApi(res, 201, "Assessment Created", assessment);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = UpdateAssessmentsSchema.parse(req.body);
    const assessment = await AssessmentsService.updateAssessment(id, body.name);
    return ResponseApi(res, 200, "Assessment Updated", assessment);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AssessmentsService.deleteAssessment(id);
    return ResponseApi(res, 200, "Assessment Deleted");
  });

  search = asyncHandler(async (req, res) => {
    const { assessment: query } = req.query;
    const assessments = await AssessmentsService.searchAssessments(
      query as string,
    );
    return ResponseApi(res, 200, "Search Results", assessments);
  });
}
