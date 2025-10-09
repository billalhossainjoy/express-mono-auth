import jwt, { JwtPayload } from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_SECRET,
} from "./config/auth.config";
import { Account, User } from "@prisma/client";

export class CookieOptions {
  static accessCookie: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 15),
  };
  static refreshCookie: CookieOptions = {
    httpOnly: true,
    secure: false,
    path: "/auth/refresh-token",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
  };
}

export class JWT {
  static generateVerificationToken(email: string) {
    return jwt.sign({ email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  }

  static verifyVerificationToken(token: string | null) {
    if (!token) throw new Error("Invalid token");

    return jwt.verify(token, JWT_SECRET) as { email: string };
  }

  static generateAccessToken(payload: object) {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
    });
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
    });
  }

  static generateAccessTokenRefreshToken(user: { user: User } & Account) {
    const AccessToken = this.generateAccessToken({
      id: user.id,
    });

    const RefreshToken = this.generateRefreshToken({
      id: user.id,
    });

    return [AccessToken, RefreshToken];
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
  }
}
