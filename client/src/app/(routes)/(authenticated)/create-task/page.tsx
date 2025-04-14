"use client";

import React, { useEffect, useState } from "react";
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
import { createTaskSchema,CreateTaskInput} from "@/lib/zod/task";

// Custom UI components
import InputField from "@/component/UI/InputField/InputField";
import DropDownSelectField from "@/component/UI/DropDownSelectField/DropdownSelectField";

// Constant to simulate page mode. Set to true for update mode.
const isUpdate = false;
// For update mode, a hardcoded task ID is used (to be replaced later via context).
// const taskId = "0b347b40-0cd9-4df0-b0e9-458106fb22d9";

export default function CreateTaskPage() {
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

  const theme = useTheme();

  // State for project options for the dropdown.
  const [projectOptions, setProjectOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Fetch projects on component mount.
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllProjectsByUserAction();
        // Assuming response contains a "projects" array.
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

  // Options for priority and status dropdown fields.
  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DEFERRED", label: "Deferred" },
  ];

  const [priority, setPriority] = useState("MEDIUM");

  // When in update mode, fetch the task data and prefill the form.
  useEffect(() => {
    if (isUpdate) {
      (async () => {
        try {
          const response = await fetchTaskByIdAction("hardcoded-task-id");
          // Assuming the API returns data as { task: { ...taskData } }
          const taskData = response.task;
          // Reset the form with fetched task data.
          reset({
            projectId: taskData.projectId, // Updated from "group" to "projectId"
            title: taskData.title,
            description: taskData.description,
            startDate: taskData.plannedStart
              ? new Date(taskData.plannedStart).toISOString().split("T")[0]
              : "",
            endDate: taskData.plannedEnd
              ? new Date(taskData.plannedEnd).toISOString().split("T")[0]
              : "",
            priority: taskData.priority,
            estimatedTime: taskData.estimatedTime?.toString(),
            status: taskData.status,
            actualStart: taskData.actualStart
              ? new Date(taskData.actualStart).toISOString().split("T")[0]
              : "",
            actualEnd: taskData.actualEnd
              ? new Date(taskData.actualEnd).toISOString().split("T")[0]
              : "",
            isPaused: taskData.isPaused,
            completedHours: taskData.completedHours?.toString(),
          });
          setPriority(taskData.priority);
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      })();
    }
  }, [isUpdate, reset]);

  // onSubmit: If update mode, call updateTaskAction with the hardcoded id.
  const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
    try {
      if (isUpdate) {
        await updateTaskAction("hardcoded-task-id", data);
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
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            margin: "0 auto",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            {isUpdate ? "Edit Task" : "Add Task"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Row for Task Name & Project selection */}
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

                {/* Use a dropdown to select a project with the field "projectId" */}
                <DropDownSelectField
                  label="Project"
                  required
                  errorMessage={errors.projectId?.message}
                  options={projectOptions}
                  {...register("projectId")}
                />
              </Box>

              {/* Row for Description & Priority */}
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
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={priorityOptions}
                  {...register("priority")}
                />
              </Box>

              {/* Row for Planned Start & End Date */}
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

              {/* Row for Estimated Time */}
              <Box sx={{ display: "flex", gap: "5%", flexDirection: "column" }}>
                <InputField
                  label="Estimated Time (hours)"
                  type="number"
                  errorMessage={errors.estimatedTime?.message}
                  {...register("estimatedTime")}
                />
              </Box>

              {/* Only show additional fields if in update mode */}
              {isUpdate && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Timer & Status Info
                  </Typography>

                  {/* Row for Status */}
                  <DropDownSelectField
                    label="Status"
                    required
                    options={statusOptions}
                    {...register("status")}
                  />

                  {/* Row for Actual Start & End Date */}
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

                  {/* Row for Completed Hours & Timer Paused */}
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

              {/* Submit Button */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
              >
                {isUpdate ? "Update Task" : "Add Task"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
