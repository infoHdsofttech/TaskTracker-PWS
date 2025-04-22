// components/AutoPauseModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";

import {
  scheduleAutoPauseAction,
  cancelAutoPauseAction,
} from "@/actions/autopause";


export interface AutoPauseModalProps {
  open: boolean;
  onClose: () => void;

  /** Pause everything immediately */
  onPauseAll: () => Promise<void>;

  /** Cancel any pending reminder */
  onKeepRunning: () => Promise<void>;

  /** Schedule reminder in X minutes */
  onRemindLater: (delayMinutes: number) => Promise<void>;
}

export default function AutoPauseModal({
  open,
  onClose,
  onPauseAll,
  onKeepRunning,
  onRemindLater,
}: AutoPauseModalProps) {
  const [delay, setDelay] = useState<number>(15);
  const [loading, setLoading] = useState(false);

  const handlePauseNow = async () => {
    setLoading(true);
    try {
      await onPauseAll();
      toast.success("All tasks paused.");
      onClose();
    } catch {
      toast.error("Failed to pause tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeepRunning = async () => {
    setLoading(true);
    try {
      await onKeepRunning();
      toast.success("Auto‑pause reminder cancelled.");
      onClose();
    } catch {
      toast.error("Failed to cancel reminder.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemindLaterClick = async () => {
    setLoading(true);
    try {
      await onRemindLater(delay);
      toast.success(`Will remind you in ${delay} minutes.`);
      onClose();
    } catch {
      toast.error("Failed to schedule reminder.");
    } finally {
      setLoading(false);
    }
  };

  const onDelayChange = (e: SelectChangeEvent<number>) => {
    setDelay(Number(e.target.value));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Office Closed</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          It's after office hours. What would you like to do with your running tasks?
        </Typography>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Pause Now */}
          <Button
            variant="contained"
            onClick={handlePauseNow}
            disabled={loading}
          >
            Pause All Now
          </Button>

          {/* Keep Running */}
          <Button
            variant="outlined"
            onClick={handleKeepRunning}
            disabled={loading}
          >
            Keep Running
          </Button>

          {/* Remind Me Later */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="remind-delay-label">Remind Me Later</InputLabel>
              <Select
                labelId="remind-delay-label"
                value={delay}
                label="Remind Me Later"
                onChange={onDelayChange}
                disabled={loading}
              >
                {[5, 10, 15, 30, 60].map((mins) => (
                  <MenuItem key={mins} value={mins}>
                    {mins} minutes
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleRemindLaterClick}
              disabled={loading}
            >
              Set Reminder
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
