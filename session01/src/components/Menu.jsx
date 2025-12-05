import React from "react";
import { NavLink } from "react-router-dom";
import { List, ListItemButton, ListItemText, Box } from "@mui/material";

const MENU_ITEMS = [
  { label: "Accueil", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Notes", path: "/notes" },
  { label: "Étudiants", path: "/students" },
  { label: "Matières", path: "/courses" },
  { label: "À propos", path: "/about" },
];

function Menu() {
  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        borderRight: "1px solid #e2e8f0",
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        p: 2,
        flexShrink: 0, // important pour le layout
      }}
    >
      <Box sx={{ mb: 3 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: ".04em",
          }}
        >
          MBDS
        </div>
        <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
          Gestion des notes
        </div>
      </Box>

      <List sx={{ p: 0 }}>
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isActive
                    ? "rgba(148,163,184,0.3)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(148,163,184,0.2)",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );
}

export default Menu;
