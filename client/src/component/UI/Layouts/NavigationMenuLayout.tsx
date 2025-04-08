//@ts-nocheck
"use client";
import React from "react";
import {
  useMediaQuery,
  Theme,
  Drawer,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";

interface LayoutProps {
  children: React.ReactNode;
}

export default function NavigationMenuLayout({ children }: LayoutProps) {
  // Use MUI's breakpoint system to detect desktop vs. mobile
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  if (isDesktop) {
    // Desktop Layout: Permanent Drawer on the left
    return (
      <Box sx={{ display: "flex" }}>
       <Drawer
  variant="permanent"
  sx={{
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      backgroundColor: "#eef2fc",
      backgroundImage: "linear-gradient(61deg, #eef2fc 0%, #d3bcea 100%)",



    },
  }}
>
          {/* Drawer content here */}
          <Box sx={{ p: 2  }}>
            <h3>Task Tracker</h3>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Docs" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Team" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    );
  } else {
    // Mobile Layout: Bottom Navigation always visible
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box component="main" sx={{ flexGrow: 1, mb: 8 /* space for bottom nav */ }}>
          {children}
        </Box>

        {/* Fixed bottom nav */}
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
           
          }}
          elevation={3}
        >
          <BottomNavigation showLabels sx={{       backgroundColor: "#eef2fc",
      backgroundImage: "linear-gradient(61deg, #eef2fc 0%, #d3bcea 100%)",
             }}>
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Calendar" icon={<EventIcon />} />
            <BottomNavigationAction label="Docs" icon={<DescriptionIcon />} />
            <BottomNavigationAction label="Team" icon={<GroupIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    );
  }
}
