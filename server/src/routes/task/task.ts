import { Request, Response, Router } from 'express';
import prisma from '../../lib/prisma';
import verifyToken from '../../middlewares/Authenticate';

const taskRouter = Router();
const TestTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

// Create Task Endpoint: Now includes estimatedTime and uses plannedStart/End.
taskRouter.post('/create-task', verifyToken, async (req: Request, res: Response) => {
  // Destructure extra field "estimatedTime" and use projectId from the request body.
  const { title, description, projectId, startDate, endDate, priority, estimatedTime } = req.body;
  const userId = (req as any).userId; // userId provided by verifyToken middleware

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        // Use plannedStart and plannedEnd fields
        plannedStart: startDate ? new Date(startDate) : new Date(),
        plannedEnd: endDate ? new Date(endDate) : null,
        // Priority; default is set by schema if not provided
        priority: priority || "MEDIUM",
        // Convert estimatedTime to integer if provided, else leave undefined
        estimatedTime: estimatedTime !== undefined ? parseInt(estimatedTime, 10) : undefined,
        // Set the project relation via projectId
        projectId,
        // Set the authenticated user
        userId,
      },
    });
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Update Task Endpoint: Accepts updates including status, timer fields,
// plus new fields: actualStart, actualEnd, isPaused, and completedHours.
taskRouter.put('/update-task/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;
  // Notice we no longer destructure "group"; we now expect "projectId"
  const { 
    title, 
    description, 
    projectId, 
    startDate,  // This will update plannedStart
    endDate,    // This will update plannedEnd
    priority, 
    status, 
    timerStarted, 
    timerEnded,
    estimatedTime,
    actualStart,
    actualEnd,
    isPaused,
    completedHours
  } = req.body;

  try {
    // Check if the task exists and belongs to the authenticated user
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        // Update project relation if provided
        projectId: projectId ? projectId : existingTask.projectId,
        // Update planned dates if provided
        plannedStart: startDate ? new Date(startDate) : undefined,
        plannedEnd: endDate ? new Date(endDate) : undefined,
        priority,
        status,
        timerStarted: timerStarted ? new Date(timerStarted) : undefined,
        timerEnded: timerEnded ? new Date(timerEnded) : undefined,
        estimatedTime: estimatedTime !== undefined ? parseInt(estimatedTime, 10) : undefined,
        // New actual start and end fields
        actualStart: actualStart ? new Date(actualStart) : undefined,
        actualEnd: actualEnd ? new Date(actualEnd) : undefined,
        // Update pause flag if provided and valid boolean
        isPaused: typeof isPaused === 'boolean' ? isPaused : undefined,
        // Update completedHours as a float if provided
        completedHours: completedHours !== undefined ? parseFloat(completedHours) : undefined,
      },
    });
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete Task Endpoint remains unchanged.
taskRouter.delete('/delete-task/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Task deleted", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// Start Task Timer Endpoint: Sets timerStarted to current time and updates status to IN_PROGRESS.
taskRouter.post('/start-task-timer/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    // Only set actualStart if it has not been set before.
    const dataToUpdate = {
      timerStarted: new Date(),
      isPaused: false,
      status: 'IN_PROGRESS' as any,
      ...( !task.actualStart ? { actualStart: new Date() } : {} )
    };

    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json({ message: "Task timer started", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error starting task timer", error });
  }
});

// Stop Task Timer Endpoint: Sets timerEnded, marks as paused, and calculates completedHours.
taskRouter.post('/stop-task-timer/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;
  
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }
    
    const now = new Date();
    let intervalHours = 0;
    
    // Compute the elapsed time since the timer was last started.
    if (task.timerStarted) {
      intervalHours = (now.getTime() - new Date(task.timerStarted).getTime()) / (1000 * 60 * 60);
      // intervalHours = (TestTime.getTime() - new Date(task.timerStarted).getTime()) / (1000 * 60 * 60);
    }
    
    console.log("intervalHours:", intervalHours);
    // Get previously completed hours; if not set, assume 0.
    const previousCompleted = task.completedHours ? Number(task.completedHours) : 0;
    // Add the current interval to get the new total.
    const newCompletedHours = previousCompleted + intervalHours;
    
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        timerEnded: now,
        isPaused: true, // Task is paused after stopping the timer.
        completedHours: parseFloat(newCompletedHours.toFixed(2)),
      },
    });
    
    res.status(200).json({ message: "Task timer stopped", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error stopping task timer", error });
  }
});

// Defer Task Endpoint: Marks the task as DEFERRED and optionally updates the planned start date.
taskRouter.post('/defer-task/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { newStartDate } = req.body; // Client can optionally pass a new start date
  const userId = (req as any).userId;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: 'DEFERRED',
        plannedStart: newStartDate ? new Date(newStartDate) : task.plannedStart,
      },
    });
    res.status(200).json({ message: "Task deferred", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deferring task", error });
  }
});

// GET Tasks Endpoint: Fetch tasks by status (supports "ALL" to fetch all tasks) or by month.
taskRouter.get('/get-tasks', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { status, month } = req.query; // Expected: status like "TODO", "ALL" or month in "YYYY-MM" format.
  const userId = (req as any).userId;

  // Require at least one of the query parameters.
  if (!status && !month) {
    res.status(400).json({ message: "Either status or month parameter is required" });
    return;
  }

  try {
    const filter: any = { userId };

    if (month && typeof month === 'string') {
      // Expect month in "YYYY-MM" format
      const [yearStr, monthStr] = month.split('-');
      const yearNum = parseInt(yearStr, 10);
      const monthNum = parseInt(monthStr, 10);

      if (isNaN(yearNum) || isNaN(monthNum)) {
        res.status(400).json({ message: "Invalid month format. Expected YYYY-MM" });
        return;
      }

      // Create a date range for the month.
      // For example, for "2025-04": startDate is April 1, 2025 and endDate is April 30, 2025 23:59:59.999
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

      // Use the correct field: plannedStart
      filter.plannedStart = {
        gte: startDate,
        lte: endDate,
      };
    } else if (status && typeof status === 'string') {
      if (status.toUpperCase() !== "ALL") {
        filter.status = status;
      }
    }

    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// NEW: Get a single task by its ID.
taskRouter.get('/get-task/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

export default taskRouter;
