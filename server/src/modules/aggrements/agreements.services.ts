import {
  AgreementsSchemaType,
  CreateAgreementsSchemaType,
  UpdateAgreementsSchemaType,
} from "./schema/agreements.schema";
import prisma from "../../config/prisma";
import { HttpError } from "../../lib/HttpError";

export class AgreementsService {
  static async get({ type }: AgreementsSchemaType) {
    const agreement = await prisma.aggrementInfo.findFirst({
      where: {
        type,
      },
    });
    if (!agreement) throw new HttpError(404, "Agreement not found");
    return agreement;
  }

  static async create({
    type,
    title,
    content,
    role,
  }: CreateAgreementsSchemaType) {
    return prisma.aggrementInfo.create({
      data: {
        role,
        type,
        title,
        content,
      },
    });
  }

  static async update(id: string, update: UpdateAgreementsSchemaType) {
    return prisma.aggrementInfo.update({
      where: {
        id,
      },
      data: {
        ...update,
      },
    });
  }
}
