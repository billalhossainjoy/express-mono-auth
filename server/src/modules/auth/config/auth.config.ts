import { z } from "zod";

const AuthConfigSchema = z.object({
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRY: z.number(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRY: z.number(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.number(),
});

export const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_SECRET,
  JWT_EXPIRY,
} = AuthConfigSchema.parse({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: Number(process.env.JWT_EXPIRY),
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY: Number(process.env.JWT_ACCESS_TOKEN_EXPIRY),
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY: Number(process.env.JWT_REFRESH_TOKEN_EXPIRY),
});
