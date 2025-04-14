// components/ProjectTimeComparisonBarChart.tsx
"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

interface ProjectTimeComparisonBarChartProps {
  data: any[];
}

export default function ProjectTimeComparisonBarChart({ data }: ProjectTimeComparisonBarChartProps) {
  return (
  
      <Paper 
        sx={{ 
          width: "100%", 
          height: 400,   // Give a fixed or relative height for the chart area
          p: 2          // Optional padding
        }}
        elevation={3}    // Optional shadow
      >

      <Typography variant="h5" sx={{ mb: 2 }}>Project Time Comparison </Typography>
       <Box sx={{ width: "100%", height: "80%" }}>
            <ResponsiveContainer width="100%" height="100%">
     
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="projectName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="estimatedTime" fill="#8884d8" name="Estimated Time" />
        <Bar dataKey="completedTime" fill="#82ca9d" name="Completed Time" />
      </BarChart>
      </ResponsiveContainer>
      </Box>
      
      
    </Paper>
  );
}
