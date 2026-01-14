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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Top actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 1, color: 'primary.main' }}>
          Détails du cours
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Retour
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/courses/${id}`}
            disabled={!c}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenForm(true)}
            disabled={!c}
            sx={{ borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
          >
            Modifier
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Card sx={{ mb: 2, border: "2px solid", borderColor: "error.main", boxShadow: 2 }}>
          <CardContent><Typography color="error" sx={{ fontWeight: 700 }}>{error}</Typography></CardContent>
        </Card>
      )}

      {/* Content */}
      <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <>
              <Skeleton height={38} width="40%" sx={{ mb: 1 }} />
              <Skeleton height={28} width="25%" sx={{ mb: 2 }} />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={30} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : !c ? (
            <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>Cours introuvable.</Typography>
          ) : (
            <>
              {/* Header card modernisé */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main', mb: 1 }}>
                    {c.titre}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`Code: ${c.code}`} color="primary" sx={{ fontWeight: 700 }} />
                    <Chip label={`ID: ${c._id}`} color="default" sx={{ fontWeight: 700 }} />
                  </Stack>
                </Box>

                <Chip
                  label={headerBadge}
                  color={c.actif ? "success" : "error"}
                  sx={{ fontWeight: 700, fontSize: 16, px: 2, py: 1, borderRadius: 2 }}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}><b>Crédit:</b> <span style={{ color: '#1976d2' }}>{c.credit ?? 0}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}><b>Niveau:</b> <span style={{ color: '#1976d2' }}>{c.niveau || "-"}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}><b>Filière:</b> <span style={{ color: '#1976d2' }}>{c.filiere || "-"}</span></Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}><b>Actif:</b> <span style={{ color: c.actif ? '#388e3c' : '#d32f2f' }}>{c.actif ? "Oui" : "Non"}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, p: 2, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}><b>Description</b></Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{c.description || "-"}</Typography>
                  </Box>
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
