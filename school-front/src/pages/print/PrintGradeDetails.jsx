import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Card, CardContent, Chip, Container, Divider, Grid, Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintGradeDetails() {
  const { id } = useParams();
  const [g, setG] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/grades/${id}`);
      setG(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const now = useMemo(() => new Date().toLocaleString(), []);

  const pct = useMemo(() => {
    const n = Number(g?.note) || 0;
    const s = Number(g?.sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  }, [g]);

  const s = g?.student || {};
  const c = g?.course || {};
  const fullName = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (g?.studentId || "-");
  const courseName = c.code ? `${c.code} • ${c.titre}` : (g?.courseId || "-");

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Fiche note" backTo="/grades" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
        
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
              <Box>
                <Typography  variant="h4" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                  Fiche note
                </Typography>
                
              </Box>

              <Chip label={`${pct}%`} variant="outlined" sx={{ fontWeight: 900 }} />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : !g ? (
            <Typography>Note introuvable.</Typography>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {courseName} • {g.periode || "-"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Note:</b> {g.note} / {g.sur}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Période:</b> {g.periode || "-"}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography><b>Remarque:</b> {g.remarque || "-"}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      ID: {g._id}
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
