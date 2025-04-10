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
  startDate?: string;    // Typically plannedStart is used for initial timer start
  endDate?: string;      // plannedEnd
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
  // Helper function to format time strings into a concise format.
  const formatTime = (dateStr?: string) => {

    if (!dateStr) return "No time";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper to format full date and time (for actualStart/actualEnd)
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  // Render action buttons based on the task's current status and pause flag.
  const renderTaskActions = () => {
    switch (task.status) {
      case "PENDING":
        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onStart && (
              <Button
                variant="outlined"
                size="small"
                sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                startIcon={<PlayArrowIcon sx={{color:"#5f33e1"}}/>}
                onClick={() => onStart(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                startIcon={<EditIcon sx={{color:"#5f33e1"}} />}
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
          // If paused, show Resume, Edit, and Delete options.
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onResume && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                  startIcon={<PlayArrowIcon sx={{color:"#5f33e1"}} />}
                  onClick={() => onResume(task.id)}
                >
                  Resume
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                  startIcon={<EditIcon sx={{color:"#5f33e1"}} />}
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
          // If running, show Pause, Complete, Edit, and Delete options.
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onPause && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                  startIcon={<PauseIcon sx={{color:"#5f33e1"}}/>}
                  onClick={() => onPause(task.id)}
                >
                  Pause
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                  startIcon={<CheckIcon sx={{color:"#5f33e1"}} />}
                  onClick={() => onComplete(task.id)}
                >
                  Complete
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                  startIcon={<EditIcon sx={{color:"#5f33e1"}}/>}
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
                sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
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
                sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                size="small"
                startIcon={<PlayArrowIcon sx={{color:"#5f33e1"}} />}
                onClick={() => onResume(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                sx={{color:"#5f33e1",borderColor:"#5f33e1"}}
                startIcon={<EditIcon sx={{color:"#5f33e1"}}/>}
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

  console.log("got task in TaskCard:", task);
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
      {/* Task Group */}
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
            {formatTime(task.actualStart)}
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

      {/* Task Summary Details */}
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="caption" color="text.secondary">
          ⏱ Estimated: {task.estimatedTime ? `${task.estimatedTime} hrs` : "N/A"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ✅ Completed: {task.completedHours ? `${task.completedHours} hrs` : "N/A"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ▶ Started: {task.actualStart ? formatTime(task.actualStart) : "N/A"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ⏹ Ended: {task.actualEnd ? formatTime(task.actualEnd) : "N/A"}
        </Typography>
      </Box>
    </Paper>
  );
}
