"use client";

import React from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
  plannedStart?: string;
};

// Extend props to accept navigation callback
export type TaskCalendarProps = {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
  onNavigate?: (date: Date, view: string, action: string) => void;
};

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onDateClick, onNavigate }) => {
  // Convert each task with a valid startDate to an all-day event.
  const events = tasks
    .filter(task => task.plannedStart)
    .map(task => {
      const start = new Date(task.plannedStart!);
      // Assume an all-day event lasts until the end of that day.
      const end = new Date(task.plannedStart!);
      end.setHours(23, 59, 59, 999);
      return {
        id: task.id,
        title: task.title, // If you want an empty dot, you can set title: "".
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

  return (
    <div style={{ height: '800px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month']}
        toolbar
        selectable
        onSelectSlot={(slotInfo: SlotInfo) => {
          if (onDateClick) {
            onDateClick(slotInfo.start);
          }
        }}
        // onNavigate will be called when the user clicks next/prev/today.
        onNavigate={(date:Date, view:string, action:string) => {
          if (onNavigate) {
            onNavigate(date, view, action);
          }
        }}
        components={{ event: CustomEvent }}
      />
    </div>
  );
};

export default TaskCalendar;
