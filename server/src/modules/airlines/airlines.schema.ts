import { z } from "zod";

// Base schema for an airline
export const AirlinesSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Airline name is required"),
});

// Schema used when creating a new airline
export const CreateAirlinesSchema = AirlinesSchema.omit({ id: true });

// Schema used when updating an airline
export const UpdateAirlinesSchema = AirlinesSchema.partial();
