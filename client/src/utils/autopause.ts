// utils/autopause.ts
"use client";

import { useState, useEffect } from "react";
import { scheduleAutoPauseAction, cancelAutoPauseAction } from "@/actions/autopause";
import { pauseAllTasksAction } from "@/actions/task";

export function useAutoPause() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check every minute if it's exactly 6:00 PM
    const checkOfficeClose = () => {
      const now = new Date();
      if (now.getHours() === 18 && now.getMinutes() === 0) {
        setOpen(true);
      }
    };
    // Run on mount + every minute
    checkOfficeClose();
    const id = setInterval(checkOfficeClose, 60_000);
    return () => clearInterval(id);
  }, []);

  const handlePauseAll = async () => {
    await pauseAllTasksAction();
    setOpen(false);
  };

  const handleKeepRunning = async () => {
    await cancelAutoPauseAction();
    setOpen(false);
  };

  const handleRemindLater = async (delayMinutes: number) => {
    await scheduleAutoPauseAction({ delayMinutes });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    open,
    handlePauseAll,
    handleKeepRunning,
    handleRemindLater,
    handleClose,
  };
}
