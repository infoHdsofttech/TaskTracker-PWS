// src/context/TaskEditContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from "react";

export interface TaskContextType {
  viewingTask: boolean;
  setViewingTask: (val: boolean) => void;
  editingTask: boolean;
  setEditingTask: (value: boolean) => void;
  taskActionType: string;
  setTaskActionType: (value: string) => void;
  taskId: string;
  setTaskId: (value: string) => void;
  taskName: string;
  setTaskName: (value: string) => void;
  taskData: any; // Replace `any` with a more specific type if available
  setTaskData: (data: any) => void;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {

  const [viewingTask, setViewingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<boolean>(false);
  
  const [taskActionType, setTaskActionType] = useState<string>("Create A New Task");
  const [taskId, setTaskId] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [taskData, setTaskData] = useState<any>(null);

  return (
    <TaskContext.Provider
      value={{
        viewingTask,
        setViewingTask,
        editingTask,
        setEditingTask,
        taskActionType,
        setTaskActionType,
        taskId,
        setTaskId,
        taskName,
        setTaskName,
        taskData,
        setTaskData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
