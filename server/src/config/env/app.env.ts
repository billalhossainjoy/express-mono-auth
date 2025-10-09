import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const AppConfigurationSchema = z.object({
  PORT: z.number().optional(),
  CLIENT_URL: z.string().optional(),
  NODE_ENV: z.string(),
});

export const { PORT, CLIENT_URL, NODE_ENV } = AppConfigurationSchema.parse({
  PORT: Number(process.env.PORT) || 3000,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
});
