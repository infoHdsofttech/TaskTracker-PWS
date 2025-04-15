// components/CompletionTimelineLineChart.tsx
"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  Brush
} from "recharts";

interface CompletionTimelineLineChartProps {
  // data is already "filled" for every day
  data: {
    date: string;
    Completed: number;
  }[];
}

export default function CompletionTimelineLineChart({
  data
}: CompletionTimelineLineChartProps) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: 400, // fixed or use something like 350 or '50vh'
        p: 2,
      }}
      elevation={3}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Completion Timeline
      </Typography>
      <Box sx={{ width: "100%", height: "80%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis with label */}
            <XAxis
              dataKey="date"
              label={{
                value: "Date",
                position: "insideBottomCenter",
                offset: -5,
              }}
              // Alternatively, you can format the date ticks:
              // tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString()}
            />

            {/* Y-axis with label */}
            <YAxis
              label={{
                value: "Completed (hrs)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            {/* Tooltip & Legend */}
            <Tooltip />
            <Legend />

            {/* The line for 'Completed' values */}
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#8884d8"
              strokeWidth={2}
            />

            {/* Brush for zoom/pan */}
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
