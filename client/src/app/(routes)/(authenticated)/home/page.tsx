"use client";
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Avatar, useTheme } from "@mui/material";

import TaskCard,{Task} from "@/component/UI/TaskCard/TaskCard";
import {
  fetchTasksByStatus,
  startTaskTimerAction,
  stopTaskTimerAction,
  updateTaskAction,
  deleteTaskAction,
  deferTaskAction,
} from "@/actions/task";
import ButtonInput from "@/component/UI/ButtonInput/ButtonInput";

export default function Home() {
  const theme = useTheme();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED">("IN_PROGRESS");

  const filters: { label: string; value: "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED" }[] = [
    { label: "All", value: "ALL" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Pending", value: "PENDING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Deferred", value: "DEFERRED" },
  ];

  const fetchTasks = async () => {
    try {
      const { tasks: fetchedTasks } = await fetchTasksByStatus(activeFilter);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter]);

  const handleStart = async (id: string) => {
    await startTaskTimerAction(id);
    await fetchTasks();
  };

  const handlePause = async (id: string) => {
    await stopTaskTimerAction(id);
    await fetchTasks();
  };


  const handleComplete = async (id: string) => {
    try {
      await updateTaskAction(id, { 
        status: "COMPLETED", 
        actualEnd: new Date().toISOString() // Record the complete time
      });
      await fetchTasks();
    } catch (error) {
      console.error("Error completing task", error);
    }
  };

  const handleDefer = async (id: string) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 2); // Example: 2 days later
    await deferTaskAction(id, newDate.toISOString());
    await fetchTasks();
  };

  const handleEdit = (id: string) => {
    // This could route to an edit page or open a modal
    console.log("Edit task", id);
  };

  const handleDelete = async (id: string) => {
    await deleteTaskAction(id);
    await fetchTasks();
  };

  const handleResume = async (id: string) => {
    await startTaskTimerAction(id);
    await fetchTasks();
  };

  const handleView = (id: string) => {
    console.log("View task", id);
    // Navigate or open modal
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundImage: theme.colors.backgroundGradientYellow,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Greeting */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src="/profile.jpg" alt="Profile" sx={{ width: 48, height: 48 }} />
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
            backgroundColor: "#7F56D9",
            color: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Your today's task almost done!
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              85%
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#7F56D9",
                "&:hover": { backgroundColor: "#f3eaff" },
              }}
            >
              View Task
            </Button>
          </Box>
        </Paper>
        {/* Status Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <ButtonInput
              key={f.value}
              text={f.label}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              active={activeFilter === f.value}
              buttonActiveBackgroundColor={theme.colors.darkPurple}
              buttonActiveFontColor="#fff"
              buttonInactiveBackgroundColor={theme.colors.lightPurple}
              buttonInactiveFontColor="#7752e6"
              fontSize={14}
              fontWeight={600}
              styles={{ width: "auto", minWidth: "100px" }}
            />
          ))}
        </Box>
        {/* Task Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No tasks found for "{activeFilter}".
            </Typography>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={handleStart}
                onPause={handlePause}
                onComplete={handleComplete}
                onDefer={handleDefer}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onResume={handleResume}
                onView={handleView}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
