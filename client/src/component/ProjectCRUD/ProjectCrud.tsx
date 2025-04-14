"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button, Modal, Paper } from "@mui/material";

import {
  getAllProjectsByUserAction,
  updateProjectAction,
  deleteProjectAction,
  createProjectAction,
} from "@/actions/project";

import { ProjectFormData, projectSchema } from "@/lib/zod/project";
import InputField from "../UI/InputField/InputField";

const ProjectCrud: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      const response = await getAllProjectsByUserAction();
      setProjects(response.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    reset({
      projectName: project.projectName,
      description: project.description,
    });
    setEditModalOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProjectAction(projectId);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    try {
      if (currentProject) {
        await updateProjectAction({ projectId: currentProject.id, ...data });
        setEditModalOpen(false);
        setCurrentProject(null);
      } else {
        await createProjectAction(data);
      }
      reset();
      fetchProjects();
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Manage Projects
      </Typography>

      {/* Create / Update Project Form */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {currentProject ? "Edit Project" : "Create New Project"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Project Name"
            type="text"
            {...register("projectName")}
            errorMessage={errors.projectName?.message}
          />
          <InputField
            label="Description"
            type="text"
            {...register("description")}
            errorMessage={errors.description?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {currentProject ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </Paper>

      {/* Project List - Scrollable */}
      <Box
        sx={{
          maxHeight: 350,
          overflowY: "auto",
          pr: 1,
        }}
      >
        {projects.map((project) => (
          <Paper
            key={project.id}
            sx={{
              p: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle1">{project.projectName}</Typography>
              {project.description && (
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              )}
            </Box>
            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => handleEdit(project)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Edit Modal is now unused, but retained in case of separate modal preference */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Project
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Project Name"
              type="text"
              {...register("projectName")}
              errorMessage={errors.projectName?.message}
            />
            <InputField
              label="Description"
              type="text"
              {...register("description")}
              errorMessage={errors.description?.message}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Update Project
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectCrud;
