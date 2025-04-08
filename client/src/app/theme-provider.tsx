// app/theme-provider.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme/theme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // On mount, read the stored theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setMode("dark");
      } else {
        setMode("light");
      }
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  }, [mode]);

  // Pick the appropriate theme
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Optional global toggle button */}
      {/* <Button onClick={toggleTheme} variant="contained" sx={{ m: 2 }}>
        Toggle Theme
      </Button> */}
      {children}
    </ThemeProvider>
  );
}
