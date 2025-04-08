"use client";
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  useTheme,
} from "@mui/material";

export default function Home() {
  const theme = useTheme();

  return (
    <Box
    sx={{
      p: 2,
    // Ensures the background covers the full viewport height
    backgroundImage: "url('/images/bg.jpg')", // Image from public folder
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }}
  >
    <Box sx={{ p: 2 }}>
      {/* Greeting & Avatar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar
          src="/profile.jpg" // Replace with a real profile image
          alt="Profile"
          sx={{ width: 48, height: 48 }}
        />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Hello, Livia Vaccaro
        </Typography>
      </Box>

      {/* Task Completion Card */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          backgroundColor: "#7F56D9", // Purple color
          color: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Your today's task almost done!
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            85%
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#7F56D9",
              "&:hover": {
                backgroundColor: "#f3eaff",
              },
            }}
          >
            View Task
          </Button>
        </Box>
      </Paper>

      {/* In Progress Section */}
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        In Progress
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Office Project
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Grocery shopping app design
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Personal Project
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Uber Eats redesign challenge
          </Typography>
        </Paper>
      </Box>

      {/* Task Groups Section */}
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Task Groups
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Office Project
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            23 Tasks (70%)
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Personal Project
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            30 Tasks (52%)
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Daily Study
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            30 Tasks (87%)
          </Typography>
        </Paper>
      </Box>
    </Box>
    </Box>
  );
}
