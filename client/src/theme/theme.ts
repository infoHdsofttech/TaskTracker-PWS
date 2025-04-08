// src/theme.ts
import { createTheme } from '@mui/material/styles';
// Extend the theme interface to include a custom 'colors' property



declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      mainText: string;
      background: string;
      // Add any additional custom color properties here
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    colors?: {
      mainText?: string;
      background?: string;
      // ... add additional custom color properties here
    };
  }
}

// Define your light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  // Set custom colors for light mode
  colors: {
    mainText: '#333333',
    background: '#ffffff',
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
    // Additional typography customizations if needed
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", sans-serif',
        },
      },
    },
  },
});

// Define your dark theme with Manrope as well
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
  // Set custom colors for dark mode
  colors: {
    mainText: '#ffffff',
    background: '#000000',
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", sans-serif',
        },
      },
    },
  },
});
