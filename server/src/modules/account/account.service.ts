import prisma from "../../config/prisma";
import { UpdatePasswordSchemaType } from "./schema/account.schema";
import { hash, verify } from "argon2";
import { HttpError } from "../../lib/HttpError";
import { generateOtp, generateToken } from "../../utlis/generate";
import { VerifyOtpSchemaType } from "../auth/schema/auth.schema";

export class AccountService {
  static async findById(id: string) {
    return prisma.account.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.account.findFirst({
      where: {
        email,
      },
      include: {
        user: true,
      },
    });
  }

  static async updatePassword(
    id: string,
    currentPassword: string,
    { oldPassword, newPassword }: UpdatePasswordSchemaType,
  ) {
    const isValidPassword = await verify(currentPassword, oldPassword);
    console.log(isValidPassword);
    if (!isValidPassword) {
      throw new HttpError(401, "Invalid password");
    }

    return prisma.account.update({
      where: {
        id,
      },
      data: {
        password: await hash(newPassword),
      },
      include: {
        user: true,
      },
    });
  }

  static async verifyOtp(id: string, otp: number) {
    try {
      return await prisma.account.update({
        where: {
          id,
          verifyOtp: otp,
        },
        data: {
          isVerified: true,
          verifyOtp: null,
          verifyToken: null,
          verifyExpiry: null,
        },
      });
    } catch (error) {
      throw new HttpError(401, "Invalid otp");
    }
  }

  static async verifyByToken(token: string) {
    console.log(token);
    const account = await prisma.account.updateMany({
      where: {
        verifyToken: token,
        verifyExpiry: {
          gte: new Date(),
        },
      },
      data: {
        isVerified: true,
        verifyOtp: null,
        verifyToken: null,
        verifyExpiry: null,
      },
    });

    if (account.count === 0) throw new HttpError(401, "Invalid token");
    return account;
  }

  static async forgotPassword(email: string) {
    const otp = generateOtp();
    const token = generateToken();
    const expiry = new Date(Date.now() + 1000 * 60 * 5);

    return await prisma.account.update({
      where: {
        email,
      },
      data: {
        forgottenOtp: otp,
        forgottenToken: token,
        forgottenExpiry: expiry,
      },
    });
  }

  static async forgotOtpVerify({ otp, email }: VerifyOtpSchemaType) {
    const account = await prisma.account.findUnique({
      where: {
        email,
        forgottenOtp: otp,
        forgottenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!account) throw new HttpError(401, "Invalid otp");
    return account;
  }

  static async resetPasswordByToken(token: string, password: string) {
    const account = await prisma.account.updateMany({
      where: {
        forgottenToken: token,
        forgottenExpiry: {
          gte: new Date(),
        },
      },
      data: {
        password: await hash(password),
        forgottenOtp: null,
        forgottenToken: null,
        forgottenExpiry: null,
      },
    });

    if (account.count === 0) throw new HttpError(400, "Invalid token");
    return account;
  }

  static async resetPasswordByOtp(
    email: string,
    otp: number,
    password: string,
  ) {
    try {
      return prisma.account.update({
        where: {
          email,
          forgottenOtp: otp,
          forgottenExpiry: {
            gte: new Date(),
          },
        },
        data: {
          password: await hash(password),
          forgottenOtp: null,
          forgottenToken: null,
          forgottenExpiry: null,
        },
      });
    } catch (error) {
      throw new HttpError(401, "Invalid otp");
    }
  }
}
