"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  fetchTaskSummary,
  fetchStatusDistribution,
  fetchTimeComparison,
  fetchTimelineData,
  fetchProjectDistribution,
} from "@/actions/analytics";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function AnalyticsDashboard() {
  const [taskData, setTaskData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [projectDistData, setProjectDistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [summary, status, time, timeline,projectDist] = await Promise.all([
          fetchTaskSummary(),
          fetchStatusDistribution(),
          fetchTimeComparison(),
          fetchTimelineData(),
          fetchProjectDistribution(),
        ]);

        console.log("Summary response:", summary);
        console.log("Status response:", status);
        console.log("Time response:", time);
        console.log("Timeline response:", timeline);
        console.log("Project Distribution response:", projectDist);

        // If summary is an array of tasks directly:
        setTaskData(Array.isArray(summary) ? summary : summary?.tasks ?? []);

        // If status is an array of objects (NOT nested):
        // e.g. [{ name: "COMPLETED", value: 4.83 }]
        // If it’s double-bracketed, flatten or take the first index.
        const safeStatusData = Array.isArray(status) && Array.isArray(status[0])
          ? status[0] // or status.flat() if needed
          : status;
        setStatusData(safeStatusData ?? []);

        // For time data, if it’s an array of arrays:
        // e.g. [ [ { name: "...", Completed: 3.76, ... } ] ]
        const safeTimeData = Array.isArray(time) && Array.isArray(time[0])
          ? time[0]
          : time;
        setTimeData(safeTimeData ?? []);

        // Same for timeline
        const safeTimelineData = Array.isArray(timeline) && Array.isArray(timeline[0])
          ? timeline[0]
          : timeline;
        setTimelineData(safeTimelineData ?? []);

        // Same for projectDist
        setProjectDistData(
          Array.isArray(projectDist) && Array.isArray(projectDist[0])
            ? projectDist[0]
            : projectDist ?? []
        );
      } catch (err) {
        console.error("Error loading dashboard analytics", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(taskData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "task_summary.xlsx");
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Task Analytics Dashboard</h2>

      <button onClick={exportToExcel} style={{ marginBottom: 20 }}>
        Download Excel
      </button>

      {/* P I E  C H A R T */}
      <h3>Status-wise Count</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {statusData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

{/* PIE CHART: Project Distribution */}
<h3>Project Distribution</h3>
      <PieChart width={400} height={300}>
      <Pie
  data={projectDistData}
  dataKey="completedTime"     // match your existing field
  nameKey="projectName"       // match your existing field
  cx="50%"
  cy="50%"
  outerRadius={100}
  label
>
  {projectDistData.map((entry, index) => (
    <Cell
      key={`cell-project-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

        <Tooltip />
        <Legend />
      </PieChart>

      


      {/* B A R  C H A R T */}
      <h3>Estimated vs Completed Time</h3>
      <BarChart width={600} height={300} data={timeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Estimated" fill="#8884d8" />
        <Bar dataKey="Completed" fill="#82ca9d" />
       
      </BarChart>

 {/* BAR CHART: Estimated vs Completed Time on a Project Basis */}
 <h3>Project Time Comparison</h3>
      <BarChart width={600} height={300} data={projectDistData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="projectName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="estimatedTime"
          fill="#8884d8"
          name="Estimated Time"
        />
        <Bar
          dataKey="completedTime"
          fill="#82ca9d"
          name="Completed Time"
        />
       
      </BarChart>

      {/* L I N E  C H A R T */}
      <h3>Completion Timeline</h3>
      <LineChart width={600} height={300} data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Completed"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}
