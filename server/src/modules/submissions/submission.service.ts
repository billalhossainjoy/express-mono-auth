import prisma from "../../config/prisma";
import { HttpError } from "../../lib/HttpError";
import {
  CreateSubmissionSchemaType,
  UpdateSubmissionSchemaType,
} from "./submission.schema";

export class SubmissionService {
  static async createSubmission(data: CreateSubmissionSchemaType) {
    const { deviceId, selectedYear, status, airlineId, assessments } = data;

    if (!deviceId) throw new HttpError(400, "Device ID is required");

    return prisma.submission.create({
      data: {
        deviceId,
        selectedYear: selectedYear ? new Date(selectedYear) : undefined,
        status,
        airlineId,
        assessments: assessments
          ? { connect: assessments.map((id) => ({ id })) }
          : undefined,
      },
      include: { assessments: true, airline: true },
    });
  }

  static async getAllSubmissions(start: number, end: number) {
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        include: { assessments: true, airline: true },
        orderBy: { createdAt: "desc" },
        skip: start,
        take: end,
      }),
      prisma.submission.count(),
    ]);

    return {
      total,
      submissions,
    };
  }

  static async getSubmissionById(id: string) {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { assessments: true, airline: true },
    });
    if (!submission) throw new HttpError(404, "Submission not found");
    return submission;
  }

  static async updateSubmission(id: string, data: UpdateSubmissionSchemaType) {
    const updated = await prisma.submission.update({
      where: { id },
      data: {
        deviceId: data.deviceId,
        selectedYear: data.selectedYear
          ? new Date(data.selectedYear)
          : undefined,
        status: data.status,
        airlineId: data.airlineId,
        assessments: data.assessments
          ? { set: data.assessments.map((id) => ({ id })) }
          : undefined,
      },
      include: { assessments: true, airline: true },
    });
    return updated;
  }

  static async deleteSubmission(id: string) {
    await prisma.submission.delete({ where: { id } });
    return { message: "Submission deleted successfully" };
  }
}
