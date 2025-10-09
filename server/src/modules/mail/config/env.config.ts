import { z } from "zod";

const AuthConfigSchema = z.object({
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string().transform((value) => Number(value)),
  MAIL_SECURE: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
});

export const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASSWORD } =
  AuthConfigSchema.parse({
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_SECURE: process.env.MAIL_SECURE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  });
