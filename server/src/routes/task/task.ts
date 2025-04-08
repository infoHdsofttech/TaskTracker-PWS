import { Request, Response,Router  } from 'express';
import prisma from '../../lib/prisma';
import verifyToken from '../../middlewares/Authenticate';

const taskRouter = Router();


taskRouter.post('/create-task', verifyToken, async (req: Request, res: Response) => {
    const { title, description, group, startDate, endDate, priority } = req.body;
    const userId = (req as any).userId; // userId provided by verifyToken middleware
  
    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          group,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          // The Task model's status and priority fields have default values in the schema.
          // Here, priority can be overridden if provided in the request.
          priority: priority || "MEDIUM",
          userId, // Associates the task with the logged-in user.
        },
      });
      res.status(201).json({ message: "Task created", task: newTask });
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error });
    }
  });
  

  taskRouter.put('/update-task/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { title, description, group, startDate, endDate, priority, status, timerStarted, timerEnded } = req.body;
  
    try {
      // Check if the task exists and belongs to the authenticated user
      const existingTask = await prisma.task.findUnique({ where: { id } });
      if (!existingTask || existingTask.userId !== userId) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      // Update the task with provided values. Fields not provided remain unchanged.
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          group,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          priority,
          status,
          timerStarted: timerStarted ? new Date(timerStarted) : undefined,
          timerEnded: timerEnded ? new Date(timerEnded) : undefined,
        },
      });
      res.status(200).json({ message: "Task updated", task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: "Error updating task", error });
    }
  });


  taskRouter.delete('/delete-task/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).userId;
  
    try {
      // Check if the task exists and belongs to the authenticated user
      const existingTask = await prisma.task.findUnique({ where: { id } });
      if (!existingTask || existingTask.userId !== userId) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      // Delete the task
      const deletedTask = await prisma.task.delete({
        where: { id },
      });
  
      res.status(200).json({ message: "Task deleted", task: deletedTask });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task", error });
    }
  });
  

  // Start Task Timer Endpoint
taskRouter.post('/start-task-timer/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).userId;
  
    try {
      // Check if task exists and belongs to the authenticated user
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== userId) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      // Update task: set timerStarted to now and update status to IN_PROGRESS
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          timerStarted: new Date(),
          status: 'IN_PROGRESS',
        },
      });
      res.status(200).json({ message: "Task timer started", task: updatedTask });
      return;
    } catch (error) {
      res.status(500).json({ message: "Error starting task timer", error });
      return;
    }
  });
  
  // Stop Task Timer Endpoint
  taskRouter.post('/stop-task-timer/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).userId;
  
    try {
      // Check if task exists and belongs to the authenticated user
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== userId) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      // Update task: set timerEnded to now
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          timerEnded: new Date(),
        },
      });
      res.status(200).json({ message: "Task timer stopped", task: updatedTask });
      return;
    } catch (error) {
      res.status(500).json({ message: "Error stopping task timer", error });
      return;
    }
  });
  
  // Defer Task Endpoint
  taskRouter.post('/defer-task/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { newStartDate } = req.body; // Optionally, the client can pass a new start date
    const userId = (req as any).userId;
  
    try {
      // Check if task exists and belongs to the authenticated user
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== userId) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      // Update task: mark as DEFERRED and update startDate if provided
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          status: 'DEFERRED',
          startDate: newStartDate ? new Date(newStartDate) : task.startDate,
        },
      });
      res.status(200).json({ message: "Task deferred", task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: "Error deferring task", error });
    }
  });
  
  export default taskRouter;