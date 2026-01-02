import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

export default function PrintToolbar({
  title = "Aperçu impression",
  backTo = "/students",
  className = "no-print"   // ✅ ajouté
}) {
  const navigate = useNavigate();

  return (
    <Box
      className={className} // ✅ maintenant défini
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 1
      }}
    >
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>

          <Typography sx={{ fontWeight: 700 }}>{title}</Typography>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Imprimer
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
