import { z } from "zod";
import { convertDollarsToCents } from "../../../lib/utils";

export const PaymentSchema = z.object({
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => convertDollarsToCents(val)),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
