import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
  }
}

const theme = createTheme({
  sidebarWidth: 240, // Default value
  sidebarMobileHeight: 56, // Default value
  palette: {
    primary: {
      main: '#0D122B',
    },
    secondary: {
      main: '#027AC5',
    },
  },
});

export default theme;
