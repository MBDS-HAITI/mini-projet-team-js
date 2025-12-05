import React from "react";
import { Box, Typography, Paper } from "@mui/material";

function Home() {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Bienvenue
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Ceci est la page d’accueil de votre application de gestion des notes.
      </Typography>

      <Paper
        elevation={2}
        sx={{
          mt: 2,
          p: 3,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Navigation
        </Typography>
        <Typography variant="body2">
          Utilisez le menu à gauche pour accéder aux :
          <br />- Notes
          <br />- Étudiants
          <br />- Matières
          <br />- À propos
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home;
