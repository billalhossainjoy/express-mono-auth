import { z } from "zod";
import { Role } from "@prisma/client";

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(Role).optional(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const VerifyOtpSchema = z.object({
  email: z.string(),
  otp: z.number(),
});

export type SignupSchemaType = z.infer<typeof SignUpSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;
