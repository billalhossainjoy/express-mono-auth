import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const CloudinaryConfigurationSchema = z.object({
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
});

export const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } =
  CloudinaryConfigurationSchema.parse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  });
