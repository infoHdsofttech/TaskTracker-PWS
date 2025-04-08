"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTaskAction, CreateTaskData } from "@/actions/task";

export default function CreateTaskPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskData>({
    defaultValues: {
      priority: "MEDIUM", // default priority
    },
  });

  const onSubmit: SubmitHandler<CreateTaskData> = async (data) => {
    try {
      // Call the create task action
      await createTaskAction(data);
      reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
     <Box
        sx={{
          p: 2,
        // Ensures the background covers the full viewport height
        backgroundImage: "url('/images/bg.jpg')", // Image from public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Add Project
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Task Group */}
          <TextField
            label="Task Group"
            fullWidth
            margin="normal"
            {...register("group", { required: "Task group is required" })}
            error={!!errors.group}
            helperText={errors.group?.message}
          />

          {/* Project Name */}
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            {...register("title", { required: "Project name is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* Description */}
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            {...register("description")}
          />

          {/* Start Date */}
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            {...register("startDate")}
            InputLabelProps={{ shrink: true }}
          />

          {/* End Date */}
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            {...register("endDate")}
            InputLabelProps={{ shrink: true }}
          />

          {/* Logo (Optional) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ mr: 2 }}>
              Change Logo
            </Typography>
            <IconButton
              color="primary"
              aria-label="upload logo"
              component="label"
            >
              <input hidden accept="image/*" type="file" />
              <PhotoCamera />
            </IconButton>
          </Box>

          {/* Priority */}
          <TextField
            label="Priority"
            select
            fullWidth
            margin="normal"
            defaultValue="MEDIUM"
            {...register("priority")}
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Add Project
          </Button>
        </form>
      </Paper>
    </Box>
    </Box>
  );
}
