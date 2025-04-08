"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  useTheme,
  Chip,
} from "@mui/material";

import { fetchTasksByStatus } from "@/actions/task";

type TaskType = {
  id: string;
  title: string;
  description?: string;
  status: string;     // "TODO" | "IN_PROGRESS" | "DONE"
  group: string;
  startDate?: string; // or Date
  endDate?: string;   // or Date
  // add other fields if needed
};

export default function Home() {
  const theme = useTheme();

  // State for tasks and current filter
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED">("ALL");

  // Status filter labels
  const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Deferred", value: "DEFERRED" },
  ];

  // Fetch tasks whenever `activeFilter` changes
  useEffect(() => {
    const getTasks = async () => {
      try {
        // If "ALL", you could create a separate fetchAllTasks() or pass "ALL" as status
        // and your backend can handle returning all tasks if status=ALL.
        const { tasks: fetchedTasks } = await fetchTasksByStatus(activeFilter);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, [activeFilter]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundImage: theme.colors.backgroundGradientYellow,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        overflowY: "auto", // So content can scroll if needed
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Greeting & Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            src="/profile.jpg" // Replace with a real profile image
            alt="Profile"
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Hello, Livia Vaccaro
          </Typography>
        </Box>

        {/* Task Completion Card */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#7F56D9", // Purple color
            color: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Your today's task almost done!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              85%
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#7F56D9",
                "&:hover": {
                  backgroundColor: "#f3eaff",
                },
              }}
            >
              View Task
            </Button>
          </Box>
        </Paper>

        {/* Status Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? "contained" : "outlined"}
              onClick={() => setActiveFilter(f.value as any)}
              sx={{
                textTransform: "none",
                ...(activeFilter === f.value && {
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                }),
              }}
            >
              {f.label}
            </Button>
          ))}
        </Box>

        {/* Display Filtered Tasks */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tasks.length === 0 && (
            <Typography variant="body1" color="text.secondary">
              No tasks found for "{activeFilter}".
            </Typography>
          )}

          {tasks.map((task) => (
            <Paper
              key={task.id}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {/* Group & Title */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {task.group || "No Group"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {task.title}
              </Typography>

              {/* Optional description */}
              {task.description && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {task.description}
                </Typography>
              )}

              {/* Example of time or other info */}
              {task.startDate && (
                <Typography variant="caption" color="text.secondary">
                  Start: {new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              )}

              {/* Task Status */}
              <Box>
                <Chip
                  label={task.status === "IN_PROGRESS" ? "In Progress" : task.status}
                  color={
                    task.status === "COMPLETED"
                      ? "success"
                      : task.status === "IN_PROGRESS"
                      ? "warning"
                      : "primary"
                  }
                  size="small"
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
