"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  Button,
  CircularProgress,  // For the loader
  useTheme
} from "@mui/material";
import { useRouter } from "next/navigation";
// Actions for tasks
import {
  createTaskAction,
  updateTaskAction,
} from "@/actions/task";
// Projects
import { getAllProjectsByUserAction } from "@/actions/project";

// Zod schema
import { createTaskSchema, CreateTaskInput } from "@/lib/zod/task";

// Context
import { TaskContext } from "@/component/context/TaskContext";

// Custom UI
import InputField from "@/component/UI/InputField/InputField";
import DropDownSelectField from "@/component/UI/DropDownSelectField/DropdownSelectField";
import DateInputField from "@/component/UI/DateInputField/DateInputField";

export default function CreateTaskPage() {
  const theme = useTheme();
  const router = useRouter();
  // Values from context
  const { editingTask, taskData, setEditingTask } = useContext(TaskContext)!;

  // React Hook Form
  const {
    control,
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

  // Project dropdown data
  const [projectOptions, setProjectOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Loader: tracks whether we’re done fetching data and setting defaults
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch project options on mount
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllProjectsByUserAction();
        const options = response.projects.map((p: any) => ({
          value: p.id,
          label: p.projectName,
        }));
        setProjectOptions(options);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    })();
  }, []);

  // Once we have projectOptions, apply edit data if needed
  useEffect(() => {
    if (projectOptions.length > 0) {
      // If in editing mode and we have data
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
      // We’ve either set edit data or we’re in create mode
      setIsLoading(false);
    }
  }, [editingTask, taskData, projectOptions, reset]);

  // Submit (create or update)
  const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
    try {
      if (editingTask && taskData) {
        // Update mode
        await updateTaskAction(taskData.id, data);
        setEditingTask(false);
        router.push("/home");
      } else {
        // Create mode
        await createTaskAction(data);
      }
      reset();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  // If we’re still loading (fetching projects or setting default values), show loader
  if (isLoading) {
    return (
      <Box
        sx={{
          p: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9f9"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Otherwise, render the form
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
              {/* Row for Task Name & Project Selection */}
              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                }}
              >
                <InputField
                  label="Task Name"
                  type="text"
                  required
                  errorMessage={errors.title?.message}
                  {...register("title")}
                />
                <Controller
                  control={control}
                  name="projectId"
                  render={({ field }) => (
                    <DropDownSelectField
                      label="Project"
                      required
                      errorMessage={errors.projectId?.message}
                      options={projectOptions}
                      {...field}
                    />
                  )}
                />
              </Box>

              {/* Row for Description & Priority */}
              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                }}
              >
                <InputField
                  label="Description"
                  type="text"
                  errorMessage={errors.description?.message}
                  {...register("description")}
                />
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <DropDownSelectField
                      label="Priority"
                      required
                      options={[
                        { value: "LOW", label: "Low" },
                        { value: "MEDIUM", label: "Medium" },
                        { value: "HIGH", label: "High" },
                      ]}
                      {...field}
                    />
                  )}
                />
              </Box>

              {/* Row for Planned Start & End Date */}
              <Box
                sx={{
                  display: "flex",
                  gap: "5%",
                  flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                }}
              >
              <DateInputField
  label="Planned Start Date"
  {...register("startDate")}
  errorMessage={errors.startDate?.message}
  // Pass disabledDates if you want to disable the date input:
  // disabledDates={taskData.status === "COMPLETED" ? true : false}
  disabledDates={(taskData?.status === "COMPLETED" || taskData?.status === "IN_PROGRESS" || taskData?.status === "DEFERRED") ? true : false}
/>

<DateInputField
  label="Planned End Date"
  {...register("endDate")}
  errorMessage={errors.endDate?.message}
  // Pass disabledDates if you want to disable the date input:
  disabledDates={(taskData?.status === "COMPLETED" || taskData?.status === "IN_PROGRESS" || taskData?.status === "DEFERRED") ? true : false}
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

              {/* Additional fields if editing */}
              {editingTask && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Timer & Status Info
                  </Typography>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <DropDownSelectField
                        label="Status"
                        required
                        options={[
                          { value: "PENDING", label: "Pending" },
                          { value: "IN_PROGRESS", label: "In Progress" },
                          { value: "COMPLETED", label: "Completed" },
                          { value: "DEFERRED", label: "Deferred" },
                        ]}
                        {...field}
                      />
                    )}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5%",
                      flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                    }}
                  >
                    {/* <InputField
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
                    /> */}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5%",
                      flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
                    }}
                  >
                    {taskData.status === "COMPLETED" && (
                           <InputField
                           label="Completed Hours"
                           type="number"
                           errorMessage={errors.completedHours?.message}
                           {...register("completedHours")}
                         />
                     )}
               
                    {/* <InputField
                      label="Timer Paused (true/false)"
                      type="text"
                      errorMessage={errors.isPaused?.message}
                      {...register("isPaused")}
                    /> */}
                  </Box>
                </>
              )}

              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
