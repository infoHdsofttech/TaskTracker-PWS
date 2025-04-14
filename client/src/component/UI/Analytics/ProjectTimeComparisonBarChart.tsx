// components/ProjectTimeComparisonBarChart.tsx
"use client";

import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface ProjectTimeComparisonBarChartProps {
  data: any[];
}

export default function ProjectTimeComparisonBarChart({ data }: ProjectTimeComparisonBarChartProps) {
  return (
    <div>
      <h3>Project Time Comparison</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="projectName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="estimatedTime" fill="#8884d8" name="Estimated Time" />
        <Bar dataKey="completedTime" fill="#82ca9d" name="Completed Time" />
      </BarChart>
    </div>
  );
}
