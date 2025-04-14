// components/TimeComparisonBarChart.tsx
"use client";

import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface TimeComparisonBarChartProps {
  data: any[];
}

export default function TimeComparisonBarChart({ data }: TimeComparisonBarChartProps) {
  return (
    <div>
      <h3>Estimated vs Completed Time (Task-wise)</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Estimated" fill="#8884d8" />
        <Bar dataKey="Completed" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
