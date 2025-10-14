import prisma from "../../config/prisma";
import { HttpError } from "../../lib/HttpError";

export class AssessmentsService {
  static async createAssessment(name: string) {
    if (!name) throw new HttpError(400, "Assessment name is required");
    return prisma.assessment.create({ data: { name } });
  }

  static async getAllAssessments() {
    return prisma.assessment.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async getAssessmentById(id: string) {
    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment) throw new HttpError(404, "Assessment not found");
    return assessment;
  }

  static async searchAssessments(query: string) {
    if (!query) throw new HttpError(400, "Search query required");
    return prisma.assessment.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
    });
  }

  static async updateAssessment(id: string, name: string | undefined) {
    if (!name) throw new HttpError(400, "Assessment name is required");
    const updated = await prisma.assessment.update({
      where: { id },
      data: { name },
    });
    if (!updated) throw new HttpError(404, "Assessment not found");
    return updated;
  }

  static async deleteAssessment(id: string) {
    const deleted = await prisma.assessment.delete({ where: { id } });
    if (!deleted) throw new HttpError(404, "Assessment not found");
    return { message: "Assessment deleted successfully" };
  }
}
