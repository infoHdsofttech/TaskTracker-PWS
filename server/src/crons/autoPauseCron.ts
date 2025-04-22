// cron/autoPauseCron.ts
import cron from "node-cron";
import prisma from "../lib/prisma";

cron.schedule("*/5 * * * *", async () => {
  console.log("Running auto-pause cron job...");
  const now = new Date();
  const due = await prisma.autoPauseSchedule.findMany({
    where: { pauseAt: { lte: now }, isPaused: false }
  });

  for (const sched of due) {
    // 1) Pause all in-progress tasks for this user
    await prisma.task.updateMany({
      where: { userId: sched.userId, status: "IN_PROGRESS" },
      data: { isPaused: true }
    });
    // 2) Mark schedule as processed
    await prisma.autoPauseSchedule.update({
      where: { id: sched.id },
      data: { isPaused: true }
    });
    console.log(`Auto-paused tasks for user ${sched.userId} at ${now}`);
  }
});


// 2) Fallback: pause everything still running at 6:10 PM every day
cron.schedule("10 18 * * *", async () => {
  console.log("⏰ Running fallback auto‑pause at 18:10…");
  const now = new Date();

  // Pause ALL in‑progress tasks that aren't already paused
  const result = await prisma.task.updateMany({
    where: { status: "IN_PROGRESS", isPaused: false },
    data: { isPaused: true }
  });

  console.log(`⏹️ Fallback paused ${result.count} tasks at ${now}`);
});
