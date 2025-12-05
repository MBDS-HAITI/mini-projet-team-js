import React from "react";
import { Typography } from "@mui/material";

function AboutPage() {
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        À propos
      </Typography>
      <Typography>
        Ce projet est réalisé par <strong>Carlory Eliantus</strong> dans le
        cadre de la session 02 : Gestion des listes dynamiques.
      </Typography>
    </div>
  );
}

export default AboutPage;
