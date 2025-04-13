// src/pages/CalendarPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import TaskCalendar, { Task } from "@/component/UI/TaskCalendar/TaskCalendar";
import { fetchTasksByMonth } from "@/actions/task"; // Now using fetchTasksByMonth
import { format } from "date-fns";

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);

  // Modal open/close handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
    setSelectedDayTasks([]);
  };

  // Fetch tasks on mount for the current month
  useEffect(() => {
    const fetchTasksForCurrentMonth = async () => {
      try {
        // Format today's date into "YYYY-MM" (e.g. "2025-04")
        const currentMonth = format(new Date(), "yyyy-MM");
        const data = await fetchTasksByMonth(currentMonth);
        setTasks(data?.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasksForCurrentMonth();
  }, []);

  // When a date is clicked in the calendar, filter tasks that occur on that day.
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Format the clicked date as "YYYY-MM-dd"
    const clickedDayKey = format(date, "yyyy-MM-dd");
    const tasksForDay = tasks.filter(task => {
      if (!task.startDate) return false;
      return format(new Date(task.startDate), "yyyy-MM-dd") === clickedDayKey;
    });
    setSelectedDayTasks(tasksForDay);
    handleOpen();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Calendar
      </Typography>

      {/* Render TaskCalendar with the tasks array and day click handler */}
      <TaskCalendar tasks={tasks} onDateClick={handleDateClick} />

      {/* Modal to show tasks for the selected date */}
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
                {/* You can add more task details as needed */}
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

export default CalendarPage;
