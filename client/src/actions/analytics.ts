import axios from "axios";
import toast from "react-hot-toast";
import { api } from "./api";
import { Task } from "@mui/icons-material";

export const fetchTaskSummary = async () => {
  try {
    const response = await api.get("/analytics/fetch-all-tasks-summary");
    // console.log("Task summary response:", response.data.tasks);
    return response.data.tasks;
  } catch (error: any) {
    console.error("Error fetching task summary:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch task summary");
  }
};

// Fetch status distribution for pie chart
export const fetchStatusDistribution = async () => {
    try {
      const response = await api.get("/analytics/status-distribution");
      console.log("fetchStatusDistribution response:", response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching status distribution:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch status distribution");
    }
  };
  
  export const fetchProjectDistribution = async () => {
    try {
      const response = await api.get("/analytics/project-distribution");
      console.log("fetchProjectDistribution response:", response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching project distribution:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch project distribution");
    }
  };

  // Fetch estimated vs completed data for bar chart
  export const fetchTimeComparison = async () => {
    try {
      const response = await api.get("/analytics/task-time-comparison");
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching time comparison:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch time comparison");
    }
  };
  
  // Fetch timeline data for line chart
  export const fetchTimelineData = async () => {
    try {
      const response = await api.get("/analytics/timeline");
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching timeline data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch timeline data");
    }
  };
  