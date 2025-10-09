import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
