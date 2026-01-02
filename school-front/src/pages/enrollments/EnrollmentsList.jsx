import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Grid, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../api/http";
import EnrollmentForm from "./EnrollmentForm";

const statutChip = (statut) => {
  if (statut === "VALIDE") return { label: "Validé", variant: "outlined" };
  if (statut === "EN_ATTENTE") return { label: "En attente", variant: "outlined" };
  if (statut === "ANNULE") return { label: "Annulé", variant: "outlined" };
  return { label: statut || "-", variant: "outlined" };
};

export default function EnrollmentsList() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [en, st, co] = await Promise.all([
        api.get("/api/enrollments"),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setItems(en.data);
      setStudents(st.data);
      setCourses(co.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement inscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((e) => {
      const s = e.student || {};
      const c = e.course || {};
      const values = [
        s.matricule, s.prenom, s.nom,
        c.code, c.titre,
        e.anneeAcademique,
        e.statut,
        String(e.dateInscription || "")
      ].filter(Boolean);
      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const openCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (en) => {
    setEditing(en);
    setOpenForm(true);
  };

  const submitForm = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) await api.put(`/api/enrollments/${editing._id}`, payload);
      else await api.post("/api/enrollments", payload);

      setOpenForm(false);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    setError("");
    try {
      await api.delete(`/api/enrollments/${id}`);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Inscriptions</Typography>
        </Grid>

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              component={RouterLink}
              to="/print/enrollments"
            >
              Aperçu liste
            </Button>

            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Ajouter
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Recherche (étudiant, cours, année, statut...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardContent>
      </Card>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent><Typography color="error">{error}</Typography></CardContent>
        </Card>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Étudiant</b></TableCell>
              <TableCell><b>Cours</b></TableCell>
              <TableCell><b>Année</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Statut</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Aucune inscription.</TableCell></TableRow>
            ) : (
              filtered.map((en) => {
                const s = en.student || {};
                const c = en.course || {};
                const chip = statutChip(en.statut);

                return (
                  <TableRow key={en._id} hover>
                    <TableCell>
                      {s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (en.studentId || "-")}
                    </TableCell>
                    <TableCell>
                      {c.code ? `${c.code} • ${c.titre}` : (en.courseId || "-")}
                    </TableCell>
                    <TableCell>{en.anneeAcademique || "-"}</TableCell>
                    <TableCell>{en.dateInscription ? String(en.dateInscription).slice(0, 10) : "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" variant={chip.variant} label={chip.label} />
                    </TableCell>
                   <TableCell align="right">
  <Stack direction="row" spacing={1} justifyContent="flex-end">
    <Button
      size="small"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      onClick={() => navigate(`/enrollments/${en._id}`)}
    >
      Détails
    </Button>

    <Button
      size="small"
      variant="outlined"
      startIcon={<EditIcon />}
      onClick={() => openEdit(en)}
    >
      Modifier
    </Button>

    <Button
      size="small"
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={() => remove(en._id)}
    >
      Supprimer
    </Button>
  </Stack>
</TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EnrollmentForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitForm}
        saving={saving}
        initialData={editing}
        students={students}
        courses={courses}
      />
    </Box>
  );
}
