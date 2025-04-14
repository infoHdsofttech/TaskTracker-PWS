import axios from "axios";
import toast from "react-hot-toast";
import { api } from "./api";

export interface CreateProjectData {
    projectName: string;
    description?: string;
  }
  
  export interface UpdateProjectData {
    projectId: string;
    projectName?: string;
    description?: string;
  }

  export const createProjectAction = async (data: CreateProjectData) => {
    try {
      const response = await api.post("/project/create-project", data);
      toast.success("Project created!");
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error creating project");
      throw error;
    }
  };
  
  export const updateProjectAction = async (data: UpdateProjectData) => {
    try {
      const response = await api.put(`/project/update-project/${data.projectId}`, data);
      toast.success("Project updated!");
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating project");
      throw error;
    }
  };

  
  export const deleteProjectAction = async (projectId: string) => {
    try {
      const response = await api.delete(`/project/delete-project/${projectId}`);
      toast.success("Project deleted!");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
  
      if (message === "Cannot delete project: Project exists in Task table") {
        toast.error("Cannot delete: Project is used in tasks.");
      } else {
        toast.error(message || "Error deleting project");
      }
  
      throw error;
    }
  };
  

  export const getAllProjectsByUserAction = async () => {
    try {
      const response = await api.get(`/project/fetch--all-projects`);
      return response.data;
    } catch (error: any) {
      toast.error("Failed to load projects");
      throw error;
    }
  };
  