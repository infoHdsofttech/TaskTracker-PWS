import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().nonempty("Project is required"),
  title: z.string().nonempty("Task name is required"),
  description: z.string().optional(),
  // startDate: z.string().optional(),
  // endDate: z.string().optional(),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  // estimatedTime: z.number(), // a number now
  estimatedTime: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number()),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DEFERRED"]).optional(),
  actualStart: z.string().optional(),
  actualEnd: z.string().optional(),
  isPaused: z.preprocess(
    (arg) => (typeof arg === "string" ? arg === "true" : arg),
    z.boolean().optional()
  ),
  // completedHours: z.number().optional(), // a number now
  completedHours: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number().optional()),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
