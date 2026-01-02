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
import GradeForm from "./GradeForm";

export default function GradeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [g, setG] = useState(null);
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
      const [gr, s, c] = await Promise.all([
        api.get(`/api/grades/${id}`),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setG(gr.data);
      setStudents(s.data);
      setCourses(c.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Note introuvable");
      setG(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const pct = useMemo(() => {
    const n = Number(g?.note) || 0;
    const s = Number(g?.sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  }, [g]);

  const submitEdit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/grades/${id}`, payload);
      setOpenForm(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const s = g?.student || {};
  const c = g?.course || {};
  const fullName = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (g?.studentId || "-");
  const courseName = c.code ? `${c.code} • ${c.titre}` : (g?.courseId || "-");

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Détails note
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Retour
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/grades/${id}`}
            disabled={!g}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenForm(true)}
            disabled={!g}
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
          ) : !g ? (
            <Typography>Note introuvable.</Typography>
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {courseName} • {g.periode || "-"}
                  </Typography>
                </Box>

                <Chip label={`${pct}%`} variant="outlined" sx={{ fontWeight: 800 }} />
              </Stack>

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
            </>
          )}
        </CardContent>
      </Card>

      <GradeForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitEdit}
        saving={saving}
        initialData={g}
        students={students}
        courses={courses}
      />
    </Container>
  );
}
