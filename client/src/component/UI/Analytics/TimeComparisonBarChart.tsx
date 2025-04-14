// components/TimeComparisonBarChart.tsx
"use client";

import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

interface TimeComparisonBarChartProps {
  data: any[];
}

export default function TimeComparisonBarChart({ data }: TimeComparisonBarChartProps) {
  return (
    <Paper 
    sx={{ 
      width: "100%", 
      height: 400,   // Give a fixed or relative height for the chart area
      p: 2          // Optional padding
    }}
    elevation={3}    // Optional shadow
  >
       <Typography variant="h5" sx={{ mb: 2 }}>Estimated vs Completed Time (Task-wise)</Typography>
       <Box sx={{ width: "100%", height: "80%" }}>
       <ResponsiveContainer width="100%" height="100%">
      
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Estimated" fill="#8884d8" />
        <Bar dataKey="Completed" fill="#82ca9d" />
      </BarChart>
      </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
