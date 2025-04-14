// components/ProjectDistributionPieChart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

interface ProjectDistributionPieChartProps {
  data: any[];
}

export default function ProjectDistributionPieChart({ data }: ProjectDistributionPieChartProps) {
  return (
    <div>
      <h3>Project Distribution</h3>
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
    </div>
  );
}
