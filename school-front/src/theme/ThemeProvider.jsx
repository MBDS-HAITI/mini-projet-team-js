import React, { useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ColorModeContext } from "./ColorModeContext";

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("mode", next);
          return next;
        });
      }
    }),
    []
  );

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        background: {
          default: isDark ? "#0B1220" : "#F6F7FB",
          paper: isDark ? "#111A2E" : "#FFFFFF"
        },
        text: {
          primary: isDark ? "#E8EEF9" : "#0B1220",
          secondary: isDark ? "rgba(232,238,249,0.75)" : "rgba(11,18,32,0.7)"
        },
        divider: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
      },

      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: "#0B1220"
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none"
            }
          }
        }
      }
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
