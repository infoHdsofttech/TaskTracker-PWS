"use client";
import React, { useContext, useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Avatar, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import TaskCard,{Task} from "@/component/UI/TaskCard/TaskCard";
import {
  fetchTasksByStatus,
  startTaskTimerAction,
  stopTaskTimerAction,
  updateTaskAction,
  deleteTaskAction,
  deferTaskAction,
} from "@/actions/task";
import { TaskContext } from "@/component/context/TaskContext";
import ButtonInput from "@/component/UI/ButtonInput/ButtonInput";
import { useUser } from "@/component/context/UserContext";

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading } = useUser();

  const { setViewingTask,setEditingTask, setTaskActionType, setTaskId, setTaskName, setTaskData } = useContext(TaskContext)!;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
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

  // Fetch all tasks once for percentage calculation
const fetchAllTasks = async () => {
  try {
    const { tasks: allFetchedTasks } = await fetchTasksByStatus("ALL");
    setAllTasks(allFetchedTasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
  }
};

// Re-fetch on mount and after filtered tasks fetch
useEffect(() => {
  fetchAllTasks();
}, []);

const calculateCompletionPercentage = () => {
  const total = allTasks.length;
  const completed = allTasks.filter((task) => task.status === "COMPLETED").length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

const taskCompletionPercentage = calculateCompletionPercentage();

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
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    setViewingTask(false); // Ensure view mode is off
    setEditingTask(true);
    setTaskActionType("Edit Task");
    setTaskId(task.id);
    setTaskName(task.title);
    setTaskData(task);
    // Then navigate to the create/edit page
    router.push("/create-task"); // Adjust the route as needed
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
    const task = tasks.find(t => t.id === id);
    if (!task) return;
  
    setEditingTask(false); // Ensure edit mode is off
    setViewingTask(true);  // Enable view mode
    setTaskActionType("View Task");
    setTaskId(task.id);
    setTaskName(task.title);
    setTaskData(task);
    router.push("/create-task"); // Reuse same route
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
          <Avatar src="/profile.jpg" alt="Profile" sx={{ width: 48, height: 48 }}>
            {loading ? "?" : (user?.name?.[0]?.toUpperCase() || "U")}
          </Avatar>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {loading ? "Loading..." : `Hello, ${user?.name || "User"}`}
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
  {taskCompletionPercentage}%
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
