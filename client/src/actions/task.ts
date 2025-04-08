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
}

export const createTaskAction = async (data: CreateTaskData) => {
  try {
    // Adjust your API route if needed ("/api/create-task" or similar)
    const response = await api.post("/task/create-task", data);
    toast.success("Task created!");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error creating task");
    throw error;
  }
};
