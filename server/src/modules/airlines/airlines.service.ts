import { HttpError } from "../../lib/HttpError";
import prisma from "../../config/prisma";

export class AirlinesService {
  static async createAirline(name: string) {
    if (!name) throw new HttpError(400, "Airline name is required");
    return prisma.airlines.create({ data: { name } });
  }

  static async getAllAirlines() {
    return prisma.airlines.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAirlineById(id: string) {
    const airline = await prisma.airlines.findUnique({ where: { id } });
    if (!airline) throw new HttpError(404, "Airline not found");
    return airline;
  }

  static async searchAirlines(query: string) {
    if (!query) throw new HttpError(400, "Search query required");
    console.log(query);
    return prisma.airlines.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
    });
  }

  static async updateAirline(id: string, name: string | undefined) {
    if (!name) throw new HttpError(400, "Airline name is required");
    const updated = await prisma.airlines.update({
      where: { id },
      data: { name },
    });
    if (!updated) throw new HttpError(404, "Airline not found");
    return updated;
  }

  static async deleteAirline(id: string) {
    const deleted = await prisma.airlines.delete({ where: { id } });
    if (!deleted) throw new HttpError(404, "Airline not found");
    return { message: "Airline deleted successfully" };
  }
}
