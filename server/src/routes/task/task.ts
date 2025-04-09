import { Request, Response, Router } from 'express';
import prisma from '../../lib/prisma';
import verifyToken from '../../middlewares/Authenticate';

const taskRouter = Router();

// Create Task Endpoint: Now includes estimatedTime and uses plannedStart/End.
taskRouter.post('/create-task', verifyToken, async (req: Request, res: Response) => {
  // Destructure extra field "estimatedTime" from the request body.
  const { title, description, group, startDate, endDate, priority, estimatedTime } = req.body;
  const userId = (req as any).userId; // userId provided by verifyToken middleware

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        group,
        // Use plannedStart and plannedEnd fields
        plannedStart: startDate ? new Date(startDate) : new Date(),
        plannedEnd: endDate ? new Date(endDate) : null,
        // Priority; default is set by schema if not provided
        priority: priority || "MEDIUM",
        // Convert estimatedTime to integer if provided, else leave undefined
        estimatedTime: estimatedTime !== undefined ? parseInt(estimatedTime, 10) : undefined,
        userId, // Associates the task with the authenticated user
      },
    });
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Update Task Endpoint: Now accepts updates for status, timer fields, estimated time,
// plus new fields: actualStart, actualEnd, isPaused, and completedHours.
taskRouter.put('/update-task/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;
  const { 
    title, 
    description, 
    group, 
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
        group,
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
        // Update completedHours as integer if provided
        completedHours: completedHours !== undefined ? parseInt(completedHours, 10) : undefined,
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

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        timerStarted: new Date(),
        status: 'IN_PROGRESS',
      },
    });
    res.status(200).json({ message: "Task timer started", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error starting task timer", error });
  }
});

// Stop Task Timer Endpoint: Sets timerEnded to current time.
taskRouter.post('/stop-task-timer/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
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
        timerEnded: new Date(),
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
  const { newStartDate } = req.body; // Optionally, the client can pass a new start date
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

// GET Tasks Endpoint: Fetch tasks by status (supports "ALL" to fetch all tasks).
taskRouter.get('/get-tasks', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query; // expected values: "TODO", "IN_PROGRESS", "DONE", or "ALL"
  const userId = (req as any).userId;

  if (typeof status !== 'string') {
    res.status(400).json({ message: "Status parameter is required" });
    return;
  }

  try {
    const filter: any = { userId };

    if (status.toUpperCase() !== "ALL") {
      filter.status = status;
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
