// components/CompletionTimelineLineChart.tsx
"use client";

import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

interface CompletionTimelineLineChartProps {
  data: any[];
}

export default function CompletionTimelineLineChart({ data }: CompletionTimelineLineChartProps) {
  return (
    <div>
      <h3>Completion Timeline</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Completed" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
