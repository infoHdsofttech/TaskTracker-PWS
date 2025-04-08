"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  FormControl,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTaskAction, CreateTaskData } from "@/actions/task";

import InputField from "@/component/UI/InputField/InputField";
import DropDownSelectField from "@/component/UI/DropDownSelectField/DropdownSelectField";

export default function CreateTaskPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskData>({
    defaultValues: {
      priority: "MEDIUM", // Default
    },
  });

  const options = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  const theme = useTheme();
  const onSubmit: SubmitHandler<CreateTaskData> = async (data) => {
    try {
      // Call the create task action
      await createTaskAction(data);
      reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const [priority, setPriority] = useState("MEDIUM");

  return (
    <Box
      sx={{
        p: 2,
        // Background image for the full viewport (mobile + desktop)
        backgroundImage: theme.colors.backgroundGradientYellow, // Image from public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // So it fills entire view
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            // Responsive width
            // maxWidth: { xs: "100%",sm:'100%', md: "100%",lg:"100%" },
            margin: "0 auto",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Add Project
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
  {/* Task Group */}

  <Box sx={{ display: "flex", gap:'5%', flexDirection:{xs:'column', sm: "column" ,md:'column', lg: "row", xl:"row"}}}>
  <InputField
              label="Task Group"
              type="text"
              required
              errorMessage={errors.group?.message}
              // Spread react-hook-form register into your custom input
              {...register("group", { required: "Task group is required" })}
            />

            {/* Project Name */}
            <InputField
              label="Project Name"
              type="text"
              required
              errorMessage={errors.title?.message}
              {...register("title", { required: "Project name is required" })}
            />
</Box>


<Box sx={{ display: "flex", gap:'5%', flexDirection:{xs:'column', sm: "column" ,md:'column', lg: "row", xl:"row"}}}>
            {/* Description (multiline if desired) */}
            <InputField
              label="Description"
              type="description"
              errorMessage={errors.description?.message}
              {...register("description")}
            />

    {/* Priority */}
    <DropDownSelectField
      label="Priority"
      required
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      options={options}
      // infoText="Select the task priority"
    />
</Box>


<Box sx={{ display: "flex", gap:'5%',flexDirection:{xs:'column', sm: "column" ,md:'column', lg: "row", xl:"row"}}}>
            {/* Start Date */}
            <InputField
              label="Start Date"
              type="date"
              {...register("startDate")}
            />

            {/* End Date */}
            <InputField
              label="End Date"
              type="date"
              {...register("endDate")}
            />

    </Box>
        

            {/* Submit Button */}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
            >
              Add Project
            </Button>
            </Box>
          
          </form>
        </Box>
      </Box>
    </Box>
  );
}
