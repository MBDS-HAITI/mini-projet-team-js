import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Card, CardContent, Chip, Container, Divider, Grid, Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintCourseDetails() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/courses/${id}`);
      setC(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const now = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Fiche cours" backTo="/courses" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Fiche cours
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : !c ? (
            <Typography>Cours introuvable.</Typography>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {c.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: <b>{c.code}</b> • ID: {c._id}
                    </Typography>
                  </Box>

                  <Chip
                    label={c.actif ? "Actif" : "Inactif"}
                    variant="outlined"
                    sx={{ fontWeight: 700, alignSelf: "flex-start" }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Crédit:</b> {c.credit ?? 0}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Niveau:</b> {c.niveau || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Filière:</b> {c.filiere || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Actif:</b> {c.actif ? "Oui" : "Non"}</Typography>
                  </Grid>
                    <Grid item xs={12}>
                    <Typography><b>Description:</b> {c.description || "-"}</Typography>
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
