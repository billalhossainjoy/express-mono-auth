import { z } from "zod";

// Base schema for an assessment
export const AssessmentsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Assessment name is required"),
});

// Create schema
export const CreateAssessmentsSchema = AssessmentsSchema.omit({ id: true });

// Update schema (all optional)
export const UpdateAssessmentsSchema = AssessmentsSchema.partial();
