import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import AppThemeProvider from "./theme/ThemeProvider";
import { SnackbarProvider } from "notistack";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppThemeProvider>
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </AppThemeProvider>
  </React.StrictMode>
);

