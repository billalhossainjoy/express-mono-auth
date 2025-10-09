import prisma from "../../config/prisma";
import {
  LoginSchemaType,
  SignupSchemaType,
  VerifyOtpSchemaType,
} from "./schema/auth.schema";
import { hash, verify } from "argon2";
import { AccountService } from "../account/account.service";
import { HttpError } from "../../lib/HttpError";
import { JWT } from "./jwt";
import { generateOtp, generateToken } from "../../utlis/generate";

export class AuthService {
  static async signup({
    name,
    phone,
    email,
    password,
    role,
  }: SignupSchemaType) {
    const existingUser = await AccountService.findByEmail(email);
    if (existingUser) throw new HttpError(409, "Email already exists");

    const hashedPassword = await hash(password);

    const verifyOtp = generateOtp();
    const verifyToken = generateToken();
    const verifyExpiry = new Date(Date.now() + 1000 * 60 * 5);

    const account = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        verifyOtp,
        verifyToken,
        verifyExpiry,
        user: {
          create: {
            name,
            role,
          },
        },
      },
      include: {
        user: true,
      },
    });

    // TODO: send verification mail

    return account;
  }

  static async login({ email, password }: LoginSchemaType) {
    const account = await AccountService.findByEmail(email);
    if (!account) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isMatch = await verify(account.password, password);
    if (!isMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    if (!account.isVerified) {
      const verifyOtp = generateOtp();
      const verifyToken = generateToken();
      const verifyExpiry = new Date(Date.now() + 1000 * 60 * 5);

      await prisma.account.update({
        where: {
          id: account.id,
        },
        data: {
          verifyOtp,
          verifyToken,
          verifyExpiry,
        },
      });

      // Todo: send verification mail
    }

    return account;
  }

  static async refreshToken(token: string) {
    const id = JWT.verifyRefreshToken(token).id;
    const account = await AccountService.findById(id);
    if (!account) {
      throw new HttpError(401, "Invalid credentials");
    }

    return account;
  }

  static async checkIsVerified(id: string) {
    const account = await AccountService.findById(id);
    return account?.isVerified ?? false;
  }

  static async verifyOtp(id: string, otp: number) {
    return AccountService.verifyOtp(id, otp);
  }

  static async verifyByToken(token: string) {
    return AccountService.verifyByToken(token);
  }

  static async forgotPassword(email: string) {
    return AccountService.forgotPassword(email);
  }

  static async forgotOtpVerify({ otp, email }: VerifyOtpSchemaType) {
    return AccountService.forgotOtpVerify({ otp, email });
  }

  static async resetPasswordByToken(token: string, password: string) {
    return AccountService.resetPasswordByToken(token, password);
  }

  static async resetPasswordByOtp(
    email: string,
    otp: number,
    password: string,
  ) {
    return AccountService.resetPasswordByOtp(email, otp, password);
  }
}
