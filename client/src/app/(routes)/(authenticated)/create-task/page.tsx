"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// Action functions for task creation and update.
import {
  createTaskAction,
  updateTaskAction,
  fetchTaskByIdAction,
  CreateTaskData,
} from "@/actions/task";

// Custom UI components
import InputField from "@/component/UI/InputField/InputField";
import DropDownSelectField from "@/component/UI/DropDownSelectField/DropdownSelectField";

// Constant to simulate page mode. Set to true for update mode.
const isUpdate = true;
// For update mode, a hardcoded task ID is used (to be replaced later via context).
const taskId = "7c96ed4c-ec02-49a9-aad4-8a80a69c5f2e";

export default function CreateTaskPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskData>({
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  const theme = useTheme();

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
          const response = await fetchTaskByIdAction(taskId);
          // Assuming the API returns data as { task: { ...taskData } }
          const taskData = response.task;
          // Reset the form with fetched task data.
          reset({
            group: taskData.group,
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
          // Also update our local state if needed
          setPriority(taskData.priority);
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      })();
    }
  }, [isUpdate, reset]);

  // onSubmit: If update mode, call updateTaskAction with the hardcoded id.
  const onSubmit: SubmitHandler<CreateTaskData> = async (data) => {
    try {
      if (isUpdate) {
        await updateTaskAction(taskId, data);
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
            {isUpdate ? "Edit Project" : "Add Project"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Row for Task Group & Project Name */}
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
                  label="Task Group"
                  type="text"
                  required
                  errorMessage={errors.group?.message}
                  {...register("group", { required: "Task group is required" })}
                />
                <InputField
                  label="Project Name"
                  type="text"
                  required
                  errorMessage={errors.title?.message}
                  {...register("title", { required: "Project name is required" })}
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

              {/* Logo Upload Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Change Logo
                </Typography>
                <IconButton
                  color="primary"
                  aria-label="upload logo"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
              </Box>

              {/* Submit Button */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
              >
                {isUpdate ? "Update Project" : "Add Project"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
