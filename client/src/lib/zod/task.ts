import { z } from "zod";

export const createTaskSchema = z.object({
  // Use projectId instead of group; this must be a non-empty string.
  projectId: z.string().nonempty("Project is required"),
  title: z.string().nonempty("Task name is required"),
  
  // Optional description.
  description: z.string().optional(),
  
  // Dates are sent as strings from a date input.
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  
  // Priority must be one of the enumerated values with a default.
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  
  // estimatedTime is expected as a string from the form so we preprocess it into a number.
  estimatedTime: z.preprocess(
    (arg) => (typeof arg === "string" ? parseInt(arg, 10) : arg),
    z.number().optional()
  ),

  // Additional fields for update mode (optional):
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DEFERRED"]).optional(),
  actualStart: z.string().optional(),
  actualEnd: z.string().optional(),
  
  // The boolean field is paused. We preprocess a string "true" to true.
  isPaused: z.preprocess(
    (arg) => (typeof arg === "string" ? arg === "true" : arg),
    z.boolean().optional()
  ),
  
  // Completed hours can be preprocessed from a string to a number.
  completedHours: z.preprocess(
    (arg) => (typeof arg === "string" ? parseFloat(arg) : arg),
    z.number().optional()
  ),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
