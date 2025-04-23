import { Request, Response, Router } from "express";
import prisma from "../../lib/prisma";
import verifyToken from "../../middlewares/Authenticate";

const analyticsRouter = Router();

// // Fetch all tasks summary

analyticsRouter.get(
  "/fetch-all-tasks-summary",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      // 1) Grab tasks plus their projectName
      const tasks = await prisma.task.findMany({
        where: { userId },
        select: {
          title: true,
          status: true,
          completedHours: true,
          estimatedTime: true,
          plannedStart: true,
          project: {
            select: { projectName: true }
          },
        },
      });

      // 2) Flatten `project.projectName` into `projectName`
      const payload = tasks.map((t) => ({
        title: t.title,
        status: t.status,
        completedHours: t.completedHours,
        estimatedTime: t.estimatedTime,
        plannedStart: t.plannedStart,
        projectName: t.project.projectName,
      }));

      res.status(200).json({ message: "Task summary fetched", tasks: payload });
    } catch (error) {
      console.error("Failed to fetch task summary:", error);
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

      // console.log("Pie chart data:", data);
      res.status(200).json({ message: "Pie chart data fetched", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch status distribution", error });
    }
  }
);


analyticsRouter.get(
  "/project-distribution",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      // 1) Group tasks by projectId to get sums
      const projects = await prisma.task.groupBy({
        by: ["projectId"],         // group by the FK
        where: {
          // Filter by project.userId if tasks themselves
          // don't store the userId
          project: {
            userId,
          },
        },
        _sum: {
          completedHours: true,
          estimatedTime: true,
        },
      });

      // 2) Collect the projectIds from the groupBy result
      const projectIds = projects.map((item) => item.projectId);

      // 3) Fetch the project names from ProjectMaster
      //    using the collected projectIds
      const projectRecords = await prisma.projectMaster.findMany({
        where: { id: { in: projectIds } },
        select: { id: true, projectName: true },
      });

      // Turn these records into a map (projectId -> projectName)
      const nameMap: Record<string, string> = {};
      for (const rec of projectRecords) {
        nameMap[rec.id] = rec.projectName;
      }

      // 4) Merge them so each entry has both sums + human-readable project name
      const data = projects.map((p) => ({
        projectId: p.projectId,
        projectName: nameMap[p.projectId] || "Unknown Project",
        completedTime: p._sum.completedHours ?? 0,
        estimatedTime: p._sum.estimatedTime ?? 0,
      }));

      
      console.log("Pie chart data:", data);
      // 5) Return the final array
      res.status(200).json({ message: "Project time data fetched", data });
    } catch (error) {
      console.error("Failed to fetch project time data:", error);
      res.status(500).json({ message: "Failed to fetch project time data", error });
    }
  }
);

// Fetch estimated vs completed bar chart data
analyticsRouter.get(
  "/task-time-comparison",
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
// analyticsRouter.get(
//   "/timeline",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     const userId = (req as any).userId;
//     try {
//       const tasks = await prisma.task.findMany({
//         where: { userId },
//         select: {
//           plannedStart: true,
//           completedHours: true,
//         },
//       });

//       const data = tasks.map((task) => ({
//         date: task.plannedStart.toISOString().split("T")[0],
//         Completed: task.completedHours || 0,
//       }));

//       res.status(200).json({ message: "Timeline data fetched", data });
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch timeline data", error });
//     }
//   }
// );

analyticsRouter.get(
  "/timeline",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const tasks = await prisma.task.findMany({
      where: { userId },
      select: {
        actualStart: true,
        completedHours: true,
      },
      orderBy: {
        actualStart: 'asc'
      }
      });

      const data = tasks.map((task) => ({
      date: task.actualStart?.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0],
      Completed: task.completedHours || 0,
      }));

      res.status(200).json({ message: "Timeline data fetched", data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline data", error });
    }
  }
);

export default analyticsRouter;
