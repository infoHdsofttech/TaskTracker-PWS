import { z } from "zod";

export const projectSchema = z.object({
    projectName: z.string().min(1, "Project name is required"),
    description: z.string().optional()
  });
  
export type ProjectFormData = z.infer<typeof projectSchema>;