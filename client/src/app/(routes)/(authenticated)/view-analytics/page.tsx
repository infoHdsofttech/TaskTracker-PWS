// AnalyticsDashboard.tsx
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

// Import the separate chart components
import StatusPieChart from "@/component/UI/Analytics/PieChart";
import ProjectDistributionPieChart from "@/component/UI/Analytics//ProjectDistributionPieChart";
import TimeComparisonBarChart from "@/component/UI/Analytics//TimeComparisonBarChart";
import ProjectTimeComparisonBarChart from "@/component/UI/Analytics/ProjectTimeComparisonBarChart";
import CompletionTimelineLineChart from "@/component/UI/Analytics/CompletionTimelineLineChart";
import { Box, Typography } from "@mui/material";
import {useTheme} from "@mui/material/styles";

import Grid from '@mui/material/Grid';


export default function AnalyticsDashboard() {

  const theme = useTheme();

  const [taskData, setTaskData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [projectDistData, setProjectDistData] = useState([]);
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

        // console.log("Summary response:", summary);
        // console.log("Status response:", status);
        // console.log("Time response:", time);
        // console.log("Timeline response:", timeline);
        // console.log("Project Distribution response:", projectDist);

        // If summary is an array of tasks directly:
        setTaskData(Array.isArray(summary) ? summary : summary?.tasks ?? []);

        // For status data (flatten if nested):
        const safeStatusData =
          Array.isArray(status) && Array.isArray(status[0])
            ? status[0]
            : status;
        setStatusData(safeStatusData ?? []);

        // For time data (flatten if needed):
        const safeTimeData =
          Array.isArray(time) && Array.isArray(time[0])
            ? time[0]
            : time;
        setTimeData(safeTimeData ?? []);

        // For timeline data (flatten if needed):
        const safeTimelineData =
          Array.isArray(timeline) && Array.isArray(timeline[0])
            ? timeline[0]
            : timeline;
        setTimelineData(safeTimelineData ?? []);

        // For project distribution data (flatten if needed):
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
    return <Typography sx={{ padding: 20 }}>Loading dashboard...</Typography>;
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 },
    backgroundImage: theme.colors.backgroundGradientYellow,
    backgroundSize: "cover",
    backgroundPosition: "center",
    }}>
      <Typography variant="h2" sx={{ mb: 2 }}></Typography>
      <button onClick={exportToExcel} style={{ marginBottom: 20 }}>
      Download Excel
      </button>
      
      <Grid container spacing={3}>
        <Grid  size={{ xs: 12, md: 6 }}>
          <StatusPieChart data={statusData} />
        </Grid>
        <Grid  size={{ xs: 12, md: 6 }}>
        <ProjectDistributionPieChart data={projectDistData} />
        </Grid>

        <Grid  size={{ xs: 12, md: 6 }}>
        <TimeComparisonBarChart data={timeData} />
        </Grid>
        <Grid  size={{ xs: 12, md: 6 }}>
        <ProjectTimeComparisonBarChart data={projectDistData} />
        </Grid>

        <Grid  size={{ xs: 12, md: 6 }}>
        <CompletionTimelineLineChart data={timelineData} />
        </Grid>

      </Grid>
      
    </Box>
  );
}
