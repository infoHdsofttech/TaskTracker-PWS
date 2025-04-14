// components/StatusPieChart.tsx
"use client";

import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend,ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

interface StatusPieChartProps {
  data: any[];
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <Paper 
    sx={{ 
      width: "100%", 
      height: 400,   // Give a fixed or relative height for the chart area
      p: 2          // Optional padding
    }}
    elevation={3}    // Optional shadow
  >
    {/* Chart Title */}
    <Typography variant="h5" sx={{ mb: 2 }}>
      Status-wise Count
    </Typography>
    
    {/* Responsive container must be inside a parent that has a non-zero height */}
    <Box sx={{ width: "100%", height: "80%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
