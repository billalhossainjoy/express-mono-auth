import { z } from "zod";

export const StatisticsSchema = z.object({
  name: z.string(),
  date: z.string().transform((value) => new Date(value)),
});

export type StatisticsSchemaType = z.infer<typeof StatisticsSchema>;
