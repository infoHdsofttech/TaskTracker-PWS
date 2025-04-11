import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export interface TimerProgressProps {
  estimatedHours?: string;
  completedHours?: string;
}

/**
 * Returns a color based on the percentage completed.
 *
 * - 0% - <25%: Red
 * - 25% - <50%: Orange
 * - 50% - <75%: Yellow
 * - 75% - 100%: Green
 * - >100%: Dark Red
 */
const getColor = (percentage: number): string => {
  if (percentage < 25) {
    return "#4caf50"; // Red
  } else if (percentage < 50) {
    return "#ffeb3b"; // Orange
  } else if (percentage < 75) {
    return "#ff9800"; // Yellow
  } else if (percentage <= 100) {
    return "#f44336"; // Green
  } else {
    return "#d32f2f"; // Dark Red for over completion
  }
};

export default function TimerProgress({
  estimatedHours,
  completedHours,
}: TimerProgressProps) {
  // Convert string inputs to numbers. If no value is provided, default to 0.
  const estimated = estimatedHours ? parseFloat(estimatedHours) : 0;
  const completed = completedHours ? parseFloat(completedHours) : 0;



  // Calculate the completion percentage. Ensure that if no estimated time is set, percentage is 0.
  const percentage = estimated > 0 ? (completed / estimated) * 100 : 0;
  // Calculate the remaining time (ensure it doesn't drop below 0).
  const timeLeft = Math.max(estimated - completed, 0);
  // Get the color based on the percentage.
  const progressColor = getColor(percentage);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* Circular progress ring with customized color */}
      <Box position="relative" display="inline-flex">
        <CircularProgress 
          variant="determinate" 
          // Use Math.min to cap the rendered progress at 100%
          value={Math.min(percentage, 100)} 
          size={50}
          thickness={5}
          sx={{ color: progressColor }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Display the percentage value in the center */}
          <Typography 
            variant="caption" 
            component="div" 
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>

      {/* Display remaining time information */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {estimated > 0 
            ? `Time Left: ${timeLeft.toFixed(2)} hr${timeLeft !== 1 ? "s" : ""}`
            : "No estimated time set"}
        </Typography>
      </Box>
    </Box>
  );
}
