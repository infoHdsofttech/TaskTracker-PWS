// components/CompletionTimelineLineChart.tsx
"use client";

import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

interface CompletionTimelineLineChartProps {
  data: any[];
}

export default function CompletionTimelineLineChart({ data }: CompletionTimelineLineChartProps) {
  return (
    <Paper 
    sx={{ 
      width: "100%", 
      height: 400,   // Give a fixed or relative height for the chart area
      p: 2          // Optional padding
    }}
    elevation={3}    // Optional shadow
  >
     <Typography variant="h5" sx={{ mb: 2 }}>Completion Timeline </Typography>
     <Box sx={{ width: "100%", height: "80%" }}>
       <ResponsiveContainer width="100%" height="100%">
      
     
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Completed" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
      </ResponsiveContainer>
      </Box>
</Paper>
  );
}
