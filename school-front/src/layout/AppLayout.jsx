import React, { useContext } from "react";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { ColorModeContext } from "../theme/ThemeProvider";

export default function AppLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { toggleColorMode } = useContext(ColorModeContext);

  const role = user?.role;
  const canManage = role === "ADMIN" || role === "SCOLARITE";

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography sx={{ flexGrow: 1, fontWeight: 700 }}>
            School App
          </Typography>

          <Button color="inherit" onClick={toggleColorMode}>Theme</Button>

          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/">Home</Button>

              {canManage && (
                <Button color="inherit" component={RouterLink} to="/students">
                  Students
                </Button>
              )}

              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
