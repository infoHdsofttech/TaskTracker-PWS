import { Request, Response, Router } from "express";
import prisma from "../../lib/prisma";
import verifyToken from "../../middlewares/Authenticate";

const analyticsRouter = Router();

// Fetch all tasks summary
analyticsRouter.get(
  "/fetch-all-tasks-summary",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        select: {
          title: true,
          status: true,
          completedHours: true,
          estimatedTime: true,
          plannedStart: true,
        },
      });
      res.status(200).json({ message: "Task summary fetched", tasks });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task summary", error });
    }
  }
);

// Fetch pie chart data (total hours by status)
analyticsRouter.get(
  "/status-distribution",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const statuses = await prisma.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      });

      const data = statuses.map((status) => ({
        name: status.status,
        value: status._count.status || 0,
      }));

      console.log("Pie chart data:", data);
      res.status(200).json({ message: "Pie chart data fetched", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch status distribution", error });
    }
  }
);


// Fetch estimated vs completed bar chart data
analyticsRouter.get(
  "/time-comparison",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        select: {
          title: true,
          completedHours: true,
          estimatedTime: true,
        },
      });

      const data = tasks.map((task) => ({
        name: task.title,
        Completed: task.completedHours || 0,
        Estimated: task.estimatedTime || 0,
      }));

      res.status(200).json({ message: "Time comparison data fetched", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch time comparison data", error });
    }
  }
);

// Fetch timeline chart data
analyticsRouter.get(
  "/timeline",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        select: {
          plannedStart: true,
          completedHours: true,
        },
      });

      const data = tasks.map((task) => ({
        date: task.plannedStart.toISOString().split("T")[0],
        Completed: task.completedHours || 0,
      }));

      res.status(200).json({ message: "Timeline data fetched", data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline data", error });
    }
  }
);

export default analyticsRouter;
