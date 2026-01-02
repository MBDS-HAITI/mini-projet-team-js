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
import EnrollmentForm from "./EnrollmentForm";

const statutChip = (statut) => {
  if (statut === "VALIDE") return { label: "Validé" };
  if (statut === "EN_ATTENTE") return { label: "En attente" };
  if (statut === "ANNULE") return { label: "Annulé" };
  return { label: statut || "-" };
};

export default function EnrollmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [en, setEn] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [res, st, co] = await Promise.all([
        api.get(`/api/enrollments/${id}`),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setEn(res.data);
      setStudents(st.data);
      setCourses(co.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Inscription introuvable");
      setEn(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const submitEdit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/enrollments/${id}`, payload);
      setOpenForm(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const s = en?.student || {};
  const c = en?.course || {};
  const studentLabel = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (en?.studentId || "-");
  const courseLabel = c.code ? `${c.code} • ${c.titre}` : (en?.courseId || "-");
  const chip = statutChip(en?.statut);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Détails inscription
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Retour
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/enrollments/${id}`}
            disabled={!en}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenForm(true)}
            disabled={!en}
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

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <>
              <Skeleton height={30} width="50%" />
              <Skeleton height={22} width="30%" />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={24} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : !en ? (
            <Typography>Inscription introuvable.</Typography>
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {studentLabel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {courseLabel} • {en.anneeAcademique || "-"}
                  </Typography>
                </Box>

                <Chip label={chip.label} variant="outlined" sx={{ fontWeight: 800 }} />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><b>Année académique:</b> {en.anneeAcademique || "-"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><b>Date inscription:</b> {en.dateInscription ? String(en.dateInscription).slice(0, 10) : "-"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><b>Statut:</b> {chip.label}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    ID: {en._id}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      <EnrollmentForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitEdit}
        saving={saving}
        initialData={en}
        students={students}
        courses={courses}
      />
    </Container>
  );
}
