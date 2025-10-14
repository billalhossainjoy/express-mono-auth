import { asyncHandler } from "../../lib/AsyncHandler";
import { ResponseApi } from "../../lib/ResponseApi";
import { SubmissionService } from "./submission.service";
import {
  CreateSubmissionSchema,
  UpdateSubmissionSchema,
} from "./submission.schema";

export class SubmissionController {
  getAll = asyncHandler(async (req, res) => {
    const submissions = await SubmissionService.getAllSubmissions();
    return ResponseApi(res, 200, "All Submissions", submissions);
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await SubmissionService.getSubmissionById(id);
    return ResponseApi(res, 200, "Submission Details", submission);
  });

  create = asyncHandler(async (req, res) => {
    const body = CreateSubmissionSchema.parse(req.body);
    const submission = await SubmissionService.createSubmission(body);
    return ResponseApi(res, 201, "Submission Created", submission);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = UpdateSubmissionSchema.parse(req.body);
    const submission = await SubmissionService.updateSubmission(id, body);
    return ResponseApi(res, 200, "Submission Updated", submission);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await SubmissionService.deleteSubmission(id);
    return ResponseApi(res, 200, "Submission Deleted");
  });
}
