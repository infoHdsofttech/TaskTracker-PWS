// src/components/TaskCard.tsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export type Task = {
  id: string;
  group: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED";
  startDate?: string;
  endDate?: string;
  estimatedTime?: string;
  priority?: string;
  actualStart?: string;
  actualEnd?: string;
  isPaused?: boolean;
  completedHours?: string;
};

export type TaskCardProps = {
  task: Task;
  // Callback functions for various actions on the task.
  onStart?: (id: string) => void;
  onPause?: (id: string) => void;
  onComplete?: (id: string) => void;
  onDefer?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onResume?: (id: string) => void;
  onView?: (id: string) => void;
};

export default function TaskCard({
  task,
  onStart,
  onPause,
  onComplete,
  onDefer,
  onEdit,
  onDelete,
  onResume,
  onView,
}: TaskCardProps) {
  // Function to format time strings.
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "No time";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render action buttons based on task status and pause flag.
  const renderTaskActions = () => {
    switch (task.status) {
      case "PENDING":
        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onStart && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={() => onStart(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(task.id)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(task.id)}
              >
                Delete
              </Button>
            )}
          </Box>
        );

      case "IN_PROGRESS":
        if (task.isPaused) {
          // When paused, show Resume and Edit, Delete options.
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onResume && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => onResume(task.id)}
                >
                  Resume
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(task.id)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </Button>
              )}
            </Box>
          );
        } else {
          // When not paused, show Pause, Complete, Edit and Delete.
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onPause && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PauseIcon />}
                  onClick={() => onPause(task.id)}
                >
                  Pause
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={() => onComplete(task.id)}
                >
                  Complete
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(task.id)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </Button>
              )}
            </Box>
          );
        }

      case "COMPLETED":
        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onView && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onView(task.id)}
              >
                View
              </Button>
            )}
          </Box>
        );

      case "DEFERRED":
        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onResume && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={() => onResume(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(task.id)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(task.id)}
              >
                Delete
              </Button>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Task Group (small text) */}
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {task.group || "No Group"}
      </Typography>

      {/* Task Title */}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {task.title}
      </Typography>

      {/* Optional Description */}
      {task.description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {task.description}
        </Typography>
      )}

      {/* Time & Status Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatTime(task.startDate)}
          </Typography>
        </Box>
        <Chip
          label={task.status.charAt(0) + task.status.slice(1).toLowerCase()}
          color={
            task.status === "COMPLETED"
              ? "success"
              : task.status === "IN_PROGRESS"
              ? "warning"
              : task.status === "DEFERRED"
              ? "default"
              : "primary"
          }
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 2 }}>{renderTaskActions()}</Box>
    </Paper>
  );
}
