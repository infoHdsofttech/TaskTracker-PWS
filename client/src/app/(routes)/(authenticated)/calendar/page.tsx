// src/pages/CalendarPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import TaskCalendar from "@/component/UI/TaskCalendar/TaskCalendar";
import { fetchTasksByStatus } from "@/actions/task";
import { format } from "date-fns";

export interface Task {
  id: string;
  title: string;
  startDate?: string;
  // ... other properties
}

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);

  // Modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
    setSelectedDayTasks([]);
  };

  // Fetch tasks on mount
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const data = await fetchTasksByStatus("ALL"); // or create a dedicated fetch method
        setTasks(data?.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchAllTasks();
  }, []);

  // Whenever tasks change, group them by date
  useEffect(() => {
    const tasksMap: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      if (!task.startDate) return;

      // Convert the startDate to just "yyyy-MM-dd"
      const dateKey = format(new Date(task.startDate), "yyyy-MM-dd");
      if (!tasksMap[dateKey]) tasksMap[dateKey] = [];
      tasksMap[dateKey].push(task);
    });

    setTasksByDate(tasksMap);
  }, [tasks]);

  // Clicking a date in the calendar
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    const dateKey = format(date, "yyyy-MM-dd");
    const tasksForThisDay = tasksByDate[dateKey] || [];
    setSelectedDayTasks(tasksForThisDay);

    // If tasks are found, show the modal (or you could open a panel instead)
    handleOpen();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Calendar
      </Typography>

      {/* Calendar Display */}
      <TaskCalendar
        tasksByDate={tasksByDate}
        onDateClick={handleDateClick}
      />

      {/* Modal to show tasks for the selected day */}
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
                {/* Display more details as needed */}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tasks for this day.
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Calendar;
