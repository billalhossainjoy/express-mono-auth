import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const AppConfigurationSchema = z.object({
  GOOGLE_MAP_API_KEY: z.string(),
});

export const { GOOGLE_MAP_API_KEY } = AppConfigurationSchema.parse({
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
});
