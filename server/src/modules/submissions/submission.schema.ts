import { z } from "zod";

export const SubmissionSchema = z.object({
  id: z.string().optional(),
  deviceId: z.string().min(1, "Device ID is required"),
  selectedYear: z.string().optional(), // ISO string date
  status: z.enum(["PASS", "FAIL"]),
  airlineId: z.string().min(1, "Airline ID is required"),
  assessments: z.array(z.string()).optional(), // IDs of associated assessments
});

// Schema for create
export const CreateSubmissionSchema = SubmissionSchema.omit({ id: true });
export type CreateSubmissionSchemaType = z.infer<typeof CreateSubmissionSchema>;

// Schema for update
export const UpdateSubmissionSchema = SubmissionSchema.partial();
export type UpdateSubmissionSchemaType = z.infer<typeof UpdateSubmissionSchema>;
