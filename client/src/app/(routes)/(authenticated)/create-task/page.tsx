"use client";

import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TaskForm from "@/component/forms/TaskForm";

export default function CreateTaskPage() {
  return (
    <Box>
      <TaskForm />
    </Box>
  );
}
