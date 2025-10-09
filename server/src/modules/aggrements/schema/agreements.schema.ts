import { z } from "zod";
import { AggrementInfoType, Role } from "@prisma/client";

export const CreateAgreementsSchema = z.object({
  type: z.enum(AggrementInfoType),
  content: z.string(),
  role: z.enum(Role),
  title: z.string(),
});

export const UpdateAgreementsSchema = z.object({
  type: z.enum(AggrementInfoType),
  content: z.string(),
  role: z.enum(Role),
  title: z.string(),
});

export const AgreementsSchema = z.object({
  type: z.enum(AggrementInfoType),
});

export type AgreementsSchemaType = z.infer<typeof AgreementsSchema>;
export type CreateAgreementsSchemaType = z.infer<typeof CreateAgreementsSchema>;
export type UpdateAgreementsSchemaType = z.infer<typeof UpdateAgreementsSchema>;
