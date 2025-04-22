import { Request, Response, Router } from "express";
import prisma from "../../lib/prisma";
import verifyToken from "../../middlewares/Authenticate";
import authRouter from "../auth/auth";

const autoPauseRouter = Router();

/**
 * POST /remind-later
 * Schedule an auto‑pause after `delayMinutes` from now.
 */
autoPauseRouter.post(
  "/remind-later",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { delayMinutes } = req.body;
    const pauseAt = new Date(Date.now() + delayMinutes * 60_000);
    
    try {
      // Remove any old, un‑processed schedules
      await prisma.autoPauseSchedule.deleteMany({
        where: { userId, isPaused: false }
      });

      const schedule = await prisma.autoPauseSchedule.create({
        data: { userId, pauseAt },
      });
      res.json({ message: "Auto-pause scheduled", schedule });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Could not schedule auto-pause" });
    }
  }
);

/**
 * POST /cancel-pause
 * Cancel any pending (isPaused = false) auto‑pause schedules for this user.
 */
autoPauseRouter.post(
  "/cancel-pause",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const deleted = await prisma.autoPauseSchedule.deleteMany({
        where: { userId, isPaused: false },
      });
      res.json({
        message: "Auto-pause cancelled",
        deletedCount: deleted.count,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Could not cancel auto-pause" });
    }
  }
);


export default autoPauseRouter;
