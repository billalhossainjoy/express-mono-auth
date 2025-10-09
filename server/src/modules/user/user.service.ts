import prisma from "../../config/prisma";
import { UpdateUserSchemaType } from "./schema/user.schema";
import { Uploader } from "../../lib/cloudinary";

type LicenseType = "FRONT" | "BACK";

export class UserService {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async update(id: string, data: UpdateUserSchemaType) {
    const { phone, ...updates } = data;
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updates,
      },
    });
  }

  static async uploadAvatar(id: string, file: Express.Multer.File) {
    const oldAvatar = await this.findById(id);

    const uploadedAvatar = await Uploader.upload("avatar", file.buffer);

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: uploadedAvatar.public_id,
      },
    });

    if (oldAvatar?.avatar) await Uploader.destroy(oldAvatar.avatar);

    return uploadedAvatar;
  }
}
