import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });


export type Task = {
  id: string;
  title: string;
  plannedStart?: string;
};


export type TaskCalendarProps = {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
  onNavigate?: (date: Date, view: string, action: string) => void;
};
const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onDateClick, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = tasks
    .filter(task => task.plannedStart)
    .map(task => {
      const start = new Date(task.plannedStart!);
      const end = new Date(task.plannedStart!);
      end.setHours(23, 59, 59, 999);
      return {
        id: task.id,
        title: task.title,
        start,
        end,
        allDay: true,
      };
    });

  const handleNavigate = (date: Date, view: string, action: string) => {
    setCurrentDate(date);
    if (onNavigate) {
      onNavigate(date, view, action);
    }
  };

  return (
    <div style={{ height: '800px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate} // Controlled current date
        defaultView="month"
        views={['month']}
        toolbar
        selectable
        onSelectSlot={(slotInfo:SlotInfo) => onDateClick && onDateClick(slotInfo.start)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default TaskCalendar;
