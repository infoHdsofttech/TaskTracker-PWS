// src/app/(authenticated)/view-analytics/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  fetchTaskSummary,
  fetchStatusDistribution,
  fetchTimeComparison,
  fetchTimelineData,
  fetchProjectDistribution,
} from "@/actions/analytics";

import StatusPieChart from "@/component/UI/Analytics/PieChart";
import ProjectDistributionPieChart from "@/component/UI/Analytics/ProjectDistributionPieChart";
import TimeComparisonBarChart from "@/component/UI/Analytics/TimeComparisonBarChart";
import ProjectTimeComparisonBarChart from "@/component/UI/Analytics/ProjectTimeComparisonBarChart";
import CompletionTimelineLineChart from "@/component/UI/Analytics/CompletionTimelineLineChart";

import {
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AnalyticsDashboard() {
  const theme = useTheme();

  const [taskData, setTaskData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [projectDistData, setProjectDistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [summary, status, time, timeline, projectDist] = await Promise.all([
          fetchTaskSummary(),
          fetchStatusDistribution(),
          fetchTimeComparison(),
          fetchTimelineData(),
          fetchProjectDistribution(),
        ]);

        setTaskData(Array.isArray(summary) ? summary : summary?.tasks ?? []);
        setStatusData(
          Array.isArray(status) && Array.isArray(status[0])
            ? status[0]
            : status ?? []
        );
        setTimeData(
          Array.isArray(time) && Array.isArray(time[0]) ? time[0] : time ?? []
        );
        setTimelineData(
          Array.isArray(timeline) && Array.isArray(timeline[0])
            ? timeline[0]
            : timeline ?? []
        );
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
    const dayData = [...taskData]
      .sort(
        (a, b) =>
          new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime()
      )
      .map((t) => ({
        Date: t.plannedStart?.split?.("T")?.[0] ?? "",
        Title: t.title,
        Status: t.status,
        "Completed Hours": t.completedHours,
        "Estimated Time": t.estimatedTime,
        Project: (t as any).projectName ?? t.projectId,
      }));

    const projectData = projectDistData.map((p) => ({
      Project: p.projectName,
      "Completed Hours": p.completedTime ?? 0,
      "Estimated Time": p.estimatedTime ?? 0,
    }));

    const wb = XLSX.utils.book_new();
    const wsDay = XLSX.utils.json_to_sheet(dayData);
    const wsProj = XLSX.utils.json_to_sheet(projectData);

    XLSX.utils.book_append_sheet(wb, wsDay, "By Day");
    XLSX.utils.book_append_sheet(wb, wsProj, "By Project");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    saveAs(blob, "task_report.xlsx");
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading dashboard...</Typography>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundImage: theme.colors.backgroundGradientYellow,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Analytics Dashboard
      </Typography>

      <Button
        variant="contained"
        onClick={exportToExcel}
        sx={{ mb: 3 }}
      >
        Download Excel
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs:12, md:6 }}>
          <StatusPieChart data={statusData} />
        </Grid>

        <Grid size={{ xs:12, md:6 }}>
          <ProjectDistributionPieChart data={projectDistData} />
        </Grid>

        <Grid size={{ xs:12, md:6 }}>
          <TimeComparisonBarChart data={timeData} />
        </Grid>
        <Grid size={{ xs:12, md:6 }}>
          <ProjectTimeComparisonBarChart data={projectDistData} />
        </Grid>
        
        <Grid size={{ xs:12, md:6 }}>
          <CompletionTimelineLineChart data={timelineData} />
        </Grid>
      </Grid>
    </Box>
  );
}
