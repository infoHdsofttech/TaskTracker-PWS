// components/ProjectDistributionPieChart.tsx
"use client";

import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

interface ProjectDistributionPieChartProps {
  data: any[];
}

export default function ProjectDistributionPieChart({ data }: ProjectDistributionPieChartProps) {
  return (
    <Paper 
    sx={{ 
      width: "100%", 
      height: 400,   // Give a fixed or relative height for the chart area
      p: 2          // Optional padding
    }}
    elevation={3}    // Optional shadow
  >
    
     <Typography variant="h5" sx={{ mb: 2 }}>Project Distribution</Typography>

     <Box sx={{ width: "100%", height: "80%" }}>
     <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="completedTime" // Using completedTime from your API data
          nameKey="projectName"   // Using projectName for display
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-project-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
