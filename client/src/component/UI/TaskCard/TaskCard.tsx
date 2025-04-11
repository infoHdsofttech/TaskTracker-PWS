import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  useTheme
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimerProgress from "../TimerProgress/TimerProgress";

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
                sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                startIcon={<PlayArrowIcon sx={{ color: "#5f33e1" }} />}
                onClick={() => onStart(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                startIcon={<EditIcon sx={{ color: "#5f33e1" }} />}
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
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onResume && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                  startIcon={<PlayArrowIcon sx={{ color: "#5f33e1" }} />}
                  onClick={() => onResume(task.id)}
                >
                  Resume
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                  startIcon={<EditIcon sx={{ color: "#5f33e1" }} />}
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
          return (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {onPause && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                  startIcon={<PauseIcon sx={{ color: "#5f33e1" }} />}
                  onClick={() => onPause(task.id)}
                >
                  Pause
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                  startIcon={<CheckIcon sx={{ color: "#5f33e1" }} />}
                  onClick={() => onComplete(task.id)}
                >
                  Complete
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                  startIcon={<EditIcon sx={{ color: "#5f33e1" }} />}
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
                sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
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
                sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                size="small"
                startIcon={<PlayArrowIcon sx={{ color: "#5f33e1" }} />}
                onClick={() => onResume(task.id)}
              >
                Start/Resume
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                sx={{ color: "#5f33e1", borderColor: "#5f33e1" }}
                startIcon={<EditIcon sx={{ color: "#5f33e1" }} />}
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
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        gap: 2,
        width:{xs:'100%',sm:'100%',md:'80%',lg:'80%',xl:'50%'},
      }}
    >
      {/* Left Column: Main details and action buttons */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
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
        {/* Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Chip
            label={
              task.status.charAt(0) + task.status.slice(1).toLowerCase()
            }
            sx={{ color:task.status === "COMPLETED"
              ? theme.colors.darkGreen
              : task.status === "IN_PROGRESS"
              ? theme.colors.darkOrange
              : task.status === "DEFERRED"
              ? theme.colors.darkPink
              : theme.colors.darkBlue,
            
              backgroundColor:task.status === "COMPLETED"
              ? theme.colors.lightGreen
              : task.status === "IN_PROGRESS"
              ? theme.colors.lightOrange
              : task.status === "DEFERRED"
              ? theme.colors.lightPink
              : theme.colors.lightBlue,

              textTransform: "capitalize" 
            }}
          
            // color={
            //   task.status === "COMPLETED"
            //     ? "success"
            //     : task.status === "IN_PROGRESS"
            //     ? "warning"}
            //     : task.status === "DEFERRED"
            //     ? "default"
            //     : "primary"
            // }
            size="small"
          />
        </Box>
        {/* Action Buttons */}
        <Box sx={{ mt: 2 }}>{renderTaskActions()}</Box>
      </Box>

      {/* Right Column: Timer Progress & Summary Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: "140px",
        }}
      >
        <TimerProgress 
          estimatedHours={task.estimatedTime} 
          completedHours={task.completedHours} 
        />
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
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
      </Box>
    </Paper>
  );
}
