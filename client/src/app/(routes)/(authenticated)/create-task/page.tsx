"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button, useTheme } from "@mui/material";

// Action functions for task creation and update.
import {
  createTaskAction,
  updateTaskAction,
  fetchTaskByIdAction
} from "@/actions/task";

// Import the project action to fetch all projects.
import { getAllProjectsByUserAction } from "@/actions/project";

// Import the Zod schema and its inferred type.
import { createTaskSchema, CreateTaskInput } from "@/lib/zod/task";

// Import your context and its type.

import { TaskContext } from "@/component/context/TaskContext";

// Custom UI components
import InputField from "@/component/UI/InputField/InputField";
import DropDownSelectField from "@/component/UI/DropDownSelectField/DropdownSelectField";

export default function CreateTaskPage() {
  const theme = useTheme();

  // Get values from context. The "!" asserts that context is defined
  const { editingTask, taskData, setEditingTask } = useContext(TaskContext)!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  // State for project options dropdown.
  const [projectOptions, setProjectOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Fetch project options on mount.
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllProjectsByUserAction();
        const options = response.projects.map((project: any) => ({
          value: project.id,
          label: project.projectName,
        }));
        setProjectOptions(options);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    })();
  }, []);

  // If editing mode is on and taskData exists, prefill the form.
  useEffect(() => {
    if (editingTask && taskData) {
      reset({
        projectId: taskData.projectId,
        title: taskData.title,
        description: taskData.description,
        startDate: taskData.plannedStart
          ? new Date(taskData.plannedStart).toISOString().split("T")[0]
          : "",
        endDate: taskData.plannedEnd
          ? new Date(taskData.plannedEnd).toISOString().split("T")[0]
          : "",
        priority: taskData.priority,
        estimatedTime: taskData.estimatedTime,
        status: taskData.status,
        actualStart: taskData.actualStart
          ? new Date(taskData.actualStart).toISOString().split("T")[0]
          : "",
        actualEnd: taskData.actualEnd
          ? new Date(taskData.actualEnd).toISOString().split("T")[0]
          : "",
        isPaused: taskData.isPaused,
        completedHours: taskData.completedHours,
      });
    }
  }, [editingTask, taskData, reset]);

  // onSubmit handler calls update if editing, or create if not.
  const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
    try {
      if (editingTask && taskData) {
        await updateTaskAction(taskData.id, data);
        // Clear editing state after successful update.
        setEditingTask(false);
      } else {
        await createTaskAction(data);
      }
      reset();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundImage: theme.colors.backgroundGradientYellow,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 3, borderRadius: 2, margin: "0 auto" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            {editingTask ? "Edit Task" : "Create Task"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: {
                    xs: "column",
                    sm: "column",
                    md: "column",
                    lg: "row",
                    xl: "row",
                  },
                }}
              >
                <InputField
                  label="Task Name"
                  type="text"
                  required
                  errorMessage={errors.title?.message}
                  {...register("title")}
                />
                <DropDownSelectField
                  label="Project"
                  required
                  errorMessage={errors.projectId?.message}
                  options={projectOptions}
                  {...register("projectId")}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: {
                    xs: "column",
                    sm: "column",
                    md: "column",
                    lg: "row",
                    xl: "row",
                  },
                }}
              >
                <InputField
                  label="Description"
                  type="text"
                  errorMessage={errors.description?.message}
                  {...register("description")}
                />
                <DropDownSelectField
                  label="Priority"
                  required
                  options={[
                    { value: "LOW", label: "Low" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HIGH", label: "High" },
                  ]}
                  {...register("priority", {
                    onChange: (e) => {} // You can update local state if needed
                  })}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: {
                    xs: "column",
                    sm: "column",
                    md: "column",
                    lg: "row",
                    xl: "row",
                  },
                }}
              >
                <InputField
                  label="Planned Start Date"
                  type="date"
                  {...register("startDate")}
                />
                <InputField
                  label="Planned End Date"
                  type="date"
                  {...register("endDate")}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: "column",
                }}
              >
                <InputField
                  label="Estimated Time (hours)"
                  type="number"
                  errorMessage={errors.estimatedTime?.message}
                  {...register("estimatedTime")}
                />
              </Box>

              {/* Add additional fields if needed (e.g., for edit mode) */}
              {editingTask && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Timer & Status Info
                  </Typography>
                  <DropDownSelectField
                    label="Status"
                    required
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "IN_PROGRESS", label: "In Progress" },
                      { value: "COMPLETED", label: "Completed" },
                      { value: "DEFERRED", label: "Deferred" },
                    ]}
                    {...register("status")}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5%",
                      flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "column",
                        lg: "row",
                        xl: "row",
                      },
                    }}
                  >
                    <InputField
                      label="Actual Start Date"
                      type="date"
                      errorMessage={errors.actualStart?.message}
                      {...register("actualStart")}
                    />
                    <InputField
                      label="Actual End Date"
                      type="date"
                      errorMessage={errors.actualEnd?.message}
                      {...register("actualEnd")}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5%",
                      flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "column",
                        lg: "row",
                        xl: "row",
                      },
                    }}
                  >
                    <InputField
                      label="Completed Hours"
                      type="number"
                      errorMessage={errors.completedHours?.message}
                      {...register("completedHours")}
                    />
                    <InputField
                      label="Timer Paused (true/false)"
                      type="text"
                      errorMessage={errors.isPaused?.message}
                      {...register("isPaused")}
                    />
                  </Box>
                </>
              )}

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
