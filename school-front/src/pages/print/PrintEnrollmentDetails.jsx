import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Chip, Container, Divider, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

const labelStatut = (s) => {
  if (s === "VALIDE") return "Validé";
  if (s === "EN_ATTENTE") return "En attente";
  if (s === "ANNULE") return "Annulé";
  return s || "-";
};

export default function PrintEnrollmentDetails() {
  const { id } = useParams();
  const [en, setEn] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/enrollments/${id}`);
      setEn(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const now = useMemo(() => new Date().toLocaleString(), []);

  const s = en?.student || {};
  const c = en?.course || {};
  const studentLabel = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (en?.studentId || "-");
  const courseLabel = c.code ? `${c.code} • ${c.titre}` : (en?.courseId || "-");
  const statut = labelStatut(en?.statut);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Fiche inscription" backTo="/enrollments" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>

            <Box  sx={{ display: "flex", justifyContent: "space-between",  gap: 2 }}>
              <Box >
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                  Fiche inscription
                </Typography>
               </Box>

              <Chip label={statut} variant="outlined" sx={{ fontWeight: 900 }} />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : !en ? (
            <Typography>Inscription introuvable.</Typography>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {studentLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {courseLabel} • {en.anneeAcademique || "-"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Année:</b> {en.anneeAcademique || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Date:</b> {en.dateInscription ? String(en.dateInscription).slice(0, 10) : "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Statut:</b> {statut}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      ID: {en._id}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
