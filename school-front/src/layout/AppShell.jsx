import React, { useContext, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Stack
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import GradeIcon from "@mui/icons-material/Grade";
import DescriptionIcon from "@mui/icons-material/Description";


import { Link as RouterLink, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { ColorModeContext } from "../theme/ThemeProvider";

const drawerWidth = 260;

export default function AppShell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { toggleColorMode } = useContext(ColorModeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isScolarite = role === "SCOLARITE";
  const canManage = isAdmin || isScolarite;

  const navItems = useMemo(() => {
    if (!user) return [];
    if (role === "ADMIN") return [{ label: "Tableau de bord", to: "/admin", icon: <DashboardIcon /> }];
    if (role === "SCOLARITE") return [{ label: "Tableau de bord", to: "/scolarite", icon: <DashboardIcon /> }];
    if (role === "STUDENT") return [{ label: "Tableau de bord", to: "/student", icon: <DashboardIcon /> }];
    return [];
  }, [user, role]);

  const gestionItems = useMemo(() => {
  if (!user) return [];

  if (role === "ADMIN") {
    return [
      { label: "Étudiants", to: "/students", icon: <PeopleIcon /> },
      { label: "Cours", to: "/courses", icon: <BookIcon /> },
      { label: "Inscriptions", to: "/enrollments", icon: <HowToRegIcon /> },
      { label: "Notes", to: "/grades", icon: <GradeIcon /> },
      { label: "Utilisateurs", to: "/users", icon: <PeopleIcon /> }
    ];
  }

  if (role === "SCOLARITE") {
    return [
      { label: "Étudiants", to: "/students", icon: <PeopleIcon /> },
      { label: "Cours", to: "/courses", icon: <BookIcon /> },
      { label: "Notes", to: "/grades", icon: <GradeIcon /> }
    ];
  }

  if (role === "STUDENT") {
    return [
      { label: "Bulletin", to: "/print/bulletin", icon: <DescriptionIcon /> }
    ];
  }

  return [];
}, [user, role]);


//   const gestionItems = useMemo(() => {
//     if (!user || !canManage) return [];

//     return [
//   { label: "Étudiants", to: "/students", icon: <PeopleIcon /> },
//   { label: "Cours", to: "/courses", icon: <BookIcon /> },
//   { label: "Inscriptions", to: "/enrollments", icon: <HowToRegIcon /> },
//   { label: "Notes", to: "/grades", icon: <GradeIcon /> },
//   ...(role === "ADMIN" ? [{ label: "Utilisateurs", to: "/users", icon: <PeopleIcon /> }] : [])
// ];

//   }, [user, canManage]);

  const drawer = (
    <Box sx={{ height: "100%" }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
          School App
        </Typography>
      </Toolbar>

      <Divider />

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>
          NAVIGATION
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {navItems.map((it) => (
          <ListItemButton
            key={it.to}
            component={RouterLink}
            to={it.to}
            selected={pathname === it.to}
            onClick={() => setMobileOpen(false)}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>
          GESTION
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {gestionItems.map((it) => (
          <ListItemButton
            key={it.to}
            component={RouterLink}
            to={it.to}
            selected={pathname === it.to}
            onClick={() => setMobileOpen(false)}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  // ✅ LAYOUT LOGIN/REGISTER (sans sidebar, mais topbar BudgetHaiti)
  if (!user) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#060B1A" }}>
        <CssBaseline />
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#0B1220" }}>
          <Toolbar>
            <Typography sx={{ fontWeight: 900, mr: 3 }}>
              School App
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1}>
             

              <Button
                color="inherit"
                startIcon={<DarkModeIcon />}
                onClick={toggleColorMode}
              >
                Thème
              </Button>

              <IconButton color="inherit">
                <MenuOpenIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    );
  }

  // ✅ LAYOUT CONNECTÉ (TopBar sombre + Sidebar claire)
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "Background.default" }}>
      
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#0B1220",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: (t) => t.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((v) => !v)}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 900, mr: 2 }}>
            School App
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography sx={{ mr: 2, opacity: 0.9 }}>
            {user.email}
          </Typography>

          <Button color="inherit" component={RouterLink} to="/profile" startIcon={<HowToRegIcon />}>
            Profil
          </Button>

          <Button color="inherit" onClick={toggleColorMode} startIcon={<DarkModeIcon />}>
            Thème
          </Button>

          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Déconnexion
          </Button>

          <IconButton color="inherit" sx={{ ml: 1 }}>
            <MenuOpenIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0,0,0,0.08)"
          }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* drawer mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      {/* content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
