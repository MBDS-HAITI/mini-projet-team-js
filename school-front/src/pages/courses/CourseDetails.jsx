import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, Container, Divider, Grid,
  Skeleton, Stack, Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";
import CourseForm from "./CourseForm";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/courses/${id}`);
      setC(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Cours introuvable");
      setC(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const headerBadge = useMemo(() => {
    if (!c) return null;
    return c.actif ? "Actif" : "Inactif";
  }, [c]);

  const submitEdit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/courses/${id}`, payload);
      setOpenForm(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Top actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Détails du cours
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/courses/${id}`}
            disabled={!c}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenForm(true)}
            disabled={!c}
          >
            Modifier
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent><Typography color="error">{error}</Typography></CardContent>
        </Card>
      )}

      {/* Content */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <>
              <Skeleton height={34} width="40%" />
              <Skeleton height={24} width="25%" />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={26} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : !c ? (
            <Typography>Cours introuvable.</Typography>
          ) : (
            <>
              {/* Header card (style BudgetHaiti) */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {c.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: <b>{c.code}</b> • ID: {c._id}
                  </Typography>
                </Box>

                <Chip
                  label={headerBadge}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

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
            </>
          )}
        </CardContent>
      </Card>

      <CourseForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitEdit}
        saving={saving}
        initialData={c}
      />
    </Container>
  );
}
