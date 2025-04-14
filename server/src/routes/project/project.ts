import { Request, Response, Router } from 'express';
import prisma from '../../lib/prisma';
import verifyToken from '../../middlewares/Authenticate';

const projectRouter = Router();

// Create Project
projectRouter.post('/create-project', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { projectName, description } = req.body;
  const userId = (req as any).userId;

  try {
    // Prevent duplicate project for same user
    const existing = await prisma.projectMaster.findFirst({
      where: { userId, projectName },
    });
    if (existing) {
      res.status(400).json({ message: "Project with this name already exists." });
      return;
    }

    const project = await prisma.projectMaster.create({
      data: { projectName, description, userId },
    });
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// Update Project
projectRouter.put('/update-project/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { projectName, description } = req.body;
  const userId = (req as any).userId;

  try {
    const project = await prisma.projectMaster.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      res.status(404).json({ message: "Project not found or unauthorized" });
      return;
    }

    const updated = await prisma.projectMaster.update({
      where: { id },
      data: { projectName, description },
    });
    res.status(200).json({ message: "Project updated", project: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
});

// Delete Project
projectRouter.delete('/delete-project/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    // Check if the project exists and belongs to the user
    const project = await prisma.projectMaster.findUnique({
      where: { id },
    });

    if (!project || project.userId !== userId) {
      res.status(404).json({ message: "Project not found or unauthorized" });
      return;
    }

    // Check if any tasks reference this project
    const taskCount = await prisma.task.count({
      where: {
        projectId: id,
      },
    });

    if (taskCount > 0) {
      res.status(409).json({
        message: "Cannot delete project: Project exists in Task table",
      });
      return;
    }

    // Proceed with deletion if not referenced
    await prisma.projectMaster.delete({
      where: { id },
    });

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project", error });
  }
});
// Fetch All Projects by User
projectRouter.get('/fetch--all-projects', verifyToken, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const projects = await prisma.projectMaster.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ message: "Projects fetched", projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

// Fetch Single Project
projectRouter.get('/project/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const project = await prisma.projectMaster.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
     res.status(404).json({ message: "Project not found or unauthorized" });
     return ;
    }
    res.status(200).json({ message: "Project fetched", project });
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
});

export default projectRouter;