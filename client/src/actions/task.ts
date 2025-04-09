// src/actions/taskActions.ts
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "./api";

export interface CreateTaskData {
  group: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;

  estimatedTime?: string; // as hours (string so we can convert later)
  status?: string;
  actualStart?: string;
  actualEnd?: string;
  isPaused?: boolean;
  completedHours?: string;
}

export interface UpdateTaskData {
  group?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;

  estimatedTime?: string; // as hours (string so we can convert later)
  status?: string;
  actualStart?: string;
  actualEnd?: string;
  isPaused?: boolean;
  completedHours?: string;
}

// Create a new task
export const createTaskAction = async (data: CreateTaskData) => {
  try {
    const response = await api.post("/task/create-task", data);
    toast.success("Task created!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error creating task");
    throw error;
  }
};

// Update an existing task by ID
export const updateTaskAction = async (id: string, data: UpdateTaskData) => {
  try {
    const response = await api.put(`/task/update-task/${id}`, data);
    toast.success("Task updated!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error updating task");
    throw error;
  }
};

// Delete a task by ID
export const deleteTaskAction = async (id: string) => {
  try {
    const response = await api.delete(`/task/delete-task/${id}`);
    toast.success("Task deleted!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error deleting task");
    throw error;
  }
};

// Start task timer by task ID
export const startTaskTimerAction = async (id: string) => {
  try {
    const response = await api.post(`/task/start-task-timer/${id}`);
    toast.success("Task timer started!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error starting task timer");
    throw error;
  }
};

// Stop task timer by task ID
export const stopTaskTimerAction = async (id: string) => {
  try {
    const response = await api.post(`/task/stop-task-timer/${id}`);
    toast.success("Task timer stopped!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error stopping task timer");
    throw error;
  }
};

// Defer a task (update planned start date and set status to DEFERRED)
export const deferTaskAction = async (id: string, newStartDate: string) => {
  try {
    const response = await api.post(`/task/defer-task/${id}`, { newStartDate });
    toast.success("Task deferred!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error deferring task");
    throw error;
  }
};

// Fetch tasks by status (supports "ALL" to get all tasks)
export const fetchTasksByStatus = async (status: string) => {
  try {
    const response = await api.get(`/task/get-tasks?status=${status}`);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error fetching tasks");
    throw error;
  }
};

// Fetch a single task by its ID
export const fetchTaskByIdAction = async (id: string) => {
  try {
    const response = await api.get(`/task/get-task/${id}`);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error fetching task");
    throw error;
  }
};
