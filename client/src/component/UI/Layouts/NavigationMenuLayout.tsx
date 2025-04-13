"use client";

import React from "react";
import {
  useMediaQuery,
  Theme,
  Drawer,
  Box,
  Paper,
  List,
  useTheme,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  BottomNavigation,
  BottomNavigationAction
} from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import AddTaskIcon from "@mui/icons-material/AddTask";

// --- Memoized Drawer Component ---
const NavigationDrawer = React.memo(() => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#eef2fc",
          backgroundImage: theme.colors?.backgroundGradientPurple,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color={theme.colors?.Indigo || "primary"}>
          Task Tracker
        </Typography>
        <List sx={{ color: theme.colors?.Indigo }}>
          <ListItemButton onClick={() => router.push("/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>

          <ListItemButton onClick={() => router.push("/create-task")}>
            <ListItemIcon>
              <AddTaskIcon />
            </ListItemIcon>
            <ListItemText primary="Add Task" />
          </ListItemButton>

          <ListItemButton onClick={() => router.push("/calendar")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>

          <ListItemButton onClick={() => router.push("/team")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Team" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
});

// --- Main Layout Component ---
interface LayoutProps {
  children: React.ReactNode;
}

export default function NavigationMenuLayout({ children }: LayoutProps) {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  if (isDesktop) {
    // Desktop Layout: Permanent Drawer on the left with memoized drawer
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <NavigationDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0, // Prevents content shrinking
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  } else {
    // Mobile Layout: Bottom Navigation always visible
    const router = useRouter();
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box component="main" sx={{ flexGrow: 1, mb: 8 }}>
          {children}
        </Box>

        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            sx={{
              backgroundColor: "#eef2fc",
              backgroundImage: "linear-gradient(61deg, #eef2fc 0%, #d3bcea 100%)",
            }}
          >
            <BottomNavigationAction
              label="Home"
              icon={<HomeIcon />}
              onClick={() => router.push("/home")}
            />
            <BottomNavigationAction
              label="Calendar"
              icon={<EventIcon />}
              onClick={() => router.push("/calendar")}
            />
            <BottomNavigationAction
              label="AddTask"
              icon={<AddTaskIcon />}
              onClick={() => router.push("/create-task")}
            />
            <BottomNavigationAction label="Team" icon={<GroupIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    );
  }
}
