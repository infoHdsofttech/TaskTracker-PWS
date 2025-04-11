// src/components/CalendarComponent.tsx
import React, { useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import ArrowLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowRightIcon from "@mui/icons-material/ChevronRight";

interface TaskData {
  id: string;
  title: string;
  startDate?: string;
  // ... other task properties
}

export interface TaskCalendarProps {
  tasksByDate: Record<string, TaskData[]>;
  onDateClick?: (date: Date) => void;
}

/**
 * A simple monthly calendar component that displays dots on dates that have tasks.
 * @param tasksByDate - A record of dates (YYYY-MM-DD) to tasks.
 * @param onDateClick - Callback when user clicks a date.
 */
const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasksByDate,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Navigate to previous/next month
  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  // Prepare day cells for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);

  // The first date that should appear in the calendar grid
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  // The last date that should appear in the calendar grid
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  let day = startDate;
  const calendarDays: Date[] = [];

  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <Box>
      {/* Month + Year header with navigation */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={2}
      >
        <IconButton onClick={handlePrevMonth}>
          <ArrowLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {format(currentDate, "dd MMM yyyy")}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ArrowRightIcon />
        </IconButton>
      </Box>

      {/* Days of the week header */}
          <Grid component="div" item xs={1.7142857} textAlign="center" >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Grid item xs={1.7142857} textAlign="center" key={d}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {d}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar grid */}
      <Grid container>
        {calendarDays.map((dateItem) => {
          const formatted = format(dateItem, "yyyy-MM-dd");
          const tasksForDay = tasksByDate[formatted] || [];
          const isCurrentMonth = isSameMonth(dateItem, monthStart);

          return (
            <Grid
              item
              xs={1.7142857}
              key={formatted}
              onClick={() => onDateClick && onDateClick(dateItem)}
              sx={{
                border: "1px solid transparent",
                minHeight: 60,
                cursor: "pointer",
                backgroundColor: isSameDay(dateItem, new Date()) 
                  ? "rgba(95, 51, 225, 0.1)"  // highlight current day if you want
                  : "transparent",
                color: isCurrentMonth ? "inherit" : "text.disabled",
                "&:hover": {
                  backgroundColor: "rgba(95, 51, 225, 0.05)",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {format(dateItem, "d")}
              </Typography>

              {/* If tasks exist for this day, show a dot (or multiple) */}
              {tasksForDay.length > 0 && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#5f33e1",
                  }}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TaskCalendar;
