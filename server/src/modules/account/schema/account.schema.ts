import { z } from "zod";

export const createAccountSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  phone: z.string(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export type CreateAccountSchemaType = z.infer<typeof createAccountSchema>;
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
