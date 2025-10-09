import crypto from "crypto";

export function generateOtp(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
