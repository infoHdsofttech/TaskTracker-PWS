"use client";

import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, useTheme, Paper, Button } from "@mui/material";
import TaskCalendar, { Task } from "@/component/UI/TaskCalendar/TaskCalendar";
import { fetchTasksByMonth } from "@/actions/task";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "@/component/UI/InputField/InputField";
import { createProjectAction } from "@/actions/project";
import { projectSchema } from "@/lib/zod/project";



type ProjectFormData = z.infer<typeof projectSchema>;

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
    setSelectedDayTasks([]);
  };

  const fetchTasksForMonth = async (month: string) => {
    try {
      const data = await fetchTasksByMonth(month);
      setTasks(data?.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks for month", month, error);
    }
  };

  useEffect(() => {
    const currentMonth = format(new Date(), "yyyy-MM");
    fetchTasksForMonth(currentMonth);
  }, []);

  const handleCalendarNavigate = (date: Date, view: string, action: string) => {
    const month = format(date, "yyyy-MM");
    fetchTasksForMonth(month);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const clickedDayKey = format(date, "yyyy-MM-dd");
    const tasksForDay = tasks.filter(task => {
      if (!task.plannedStart) return false;
      return format(new Date(task.plannedStart), "yyyy-MM-dd") === clickedDayKey;
    });
    setSelectedDayTasks(tasksForDay);
    handleOpen();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProjectAction(data);
      reset();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundImage: theme.colors.backgroundGradientYellow,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Calendar
      </Typography>

      <TaskCalendar
        tasks={tasks}
        onDateClick={handleDateClick}
        onNavigate={handleCalendarNavigate}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedDate
              ? `Tasks for ${format(selectedDate, "dd MMM yyyy")}`
              : "Tasks"}
          </Typography>

          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: "rgba(0,0,0,0.04)",
                }}
              >
                <Typography variant="subtitle1">{task.title}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tasks for this day.
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Project creation form */}
      <Paper elevation={3} sx={{ mt: 5, p: 3, maxWidth: 500 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Project
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Project Name"
            type="text"
            {...register("projectName")}
            errorMessage={errors.projectName?.message}
          />

          <InputField
            label="Description"
            type="text"
            {...register("description")}
            errorMessage={errors.description?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Project
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CalendarPage;