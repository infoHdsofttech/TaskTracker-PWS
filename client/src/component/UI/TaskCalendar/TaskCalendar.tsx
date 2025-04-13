// src/component/UI/TaskCalendar/TaskCalendar.tsx
"use client";

import React from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchTasksByMonth } from '@/actions/task'; // adjust the path as needed

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Define your Task type (adjust fields as needed)
export type Task = {
  id: string;
  title: string;
  startDate?: string;
  // Add other properties if needed
};

// You can pass an array of tasks as events.
export type TaskCalendarProps = {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
};

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onDateClick }) => {
  // Convert each task with a valid startDate to an all-day event.
  // If a task does not have a startDate, skip it.
  const events = tasks
    .filter(task => task.startDate)
    .map(task => {
      const start = new Date(task.startDate!);
      // Assume an all-day event lasts until the end of that day.
      const end = new Date(task.startDate!);
      end.setHours(23, 59, 59, 999);
      return {
        id: task.id,
        title: task.title, // You can set title to "" if you want to show only a dot.
        start,
        end,
        allDay: true,
      };
    });

  // Custom event component that renders a small dot.
  const CustomEvent = () => {
    return (
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#5f33e1',
          margin: '0 auto',
        }}
      ></div>
    );
  };

  // onRangeChange is fired whenever the visible date range changes (e.g. user navigates to a new month)
  const handleRangeChange = async (range: Date[] | { start: Date; end: Date }) => {
    // Determine the month from the range.
    let month: string;
    if (Array.isArray(range) && range.length > 0) {
      // For month view, the first date of the array will work.
      month = format(range[0], "yyyy-MM");
    } else if (!Array.isArray(range)) {
      // Some views return an object with start and end.
      month = format(range.start, "yyyy-MM");
    } else {
      return;
    }

    try {
      // Fetch tasks for the month and log them.
      const data = await fetchTasksByMonth(month);
      console.log(`Fetched tasks for month ${month}:`, data);
    } catch (error) {
      console.error("Error fetching tasks for month", month, error);
    }
  };

  return (
    <div style={{ height: '800px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month']}
        selectable
        // When a day (slot) is selected, call the provided callback.
        onSelectSlot={(slotInfo: SlotInfo) => {
          if (onDateClick) {
            onDateClick(slotInfo.start);
          }
        }}
        // onRangeChange will be called when the calendar view changes (e.g., when navigating months)
        onRangeChange={handleRangeChange}
        // Render all events using the custom dot-only component.
        components={{ event: CustomEvent }}
      />
    </div>
  );
};

export default TaskCalendar;
