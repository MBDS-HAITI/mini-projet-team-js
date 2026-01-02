import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useParams } from "react-router-dom";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintStudentDetails() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/students/${id}`);
      setS(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const now = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="print-root">
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Fiche étudiant" backTo="/students"  className="no-print"/>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "start", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Fiche étudiant</Typography>
            {/* <Typography variant="body2" color="text.secondary">
              Aperçu avant impression • {now}
            </Typography> */}
          </Box>

          {/* <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} disabled={loading}>
            Imprimer
          </Button> */}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Typography>Chargement...</Typography>
        ) : !s ? (
          <Typography>Étudiant introuvable.</Typography>
        ) : (
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {s.prenom} {s.nom}
            </Typography>
            <Typography color="text.secondary">Matricule: {s.matricule}</Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><b>Email:</b> {s.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><b>Niveau:</b> {s.niveau || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><b>Filière:</b> {s.filiere || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><b>Actif:</b> {s.actif ? "Oui" : "Non"}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">ID: {s._id}</Typography>
          </Box>
        )}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {now}
          </Typography>
        </Box>
      </Container>
    </Box>
    </div>
  );
}
