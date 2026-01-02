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
import GradeForm from "./GradeForm";

export default function GradesList() {
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
      const [g, s, c] = await Promise.all([
        api.get("/api/grades"),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setItems(g.data);
      setStudents(s.data);
      setCourses(c.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((g) => {
      const s = g.student || {};
      const c = g.course || {};
      const values = [
        s.matricule, s.prenom, s.nom,
        c.code, c.titre,
        g.periode,
        String(g.note ?? ""),
        String(g.sur ?? "")
      ].filter(Boolean);

      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const openCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    setOpenForm(true);
  };

  const submitForm = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) await api.put(`/api/grades/${editing._id}`, payload);
      else await api.post("/api/grades", payload);

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
    if (!confirm("Supprimer cette note ?")) return;
    setError("");
    try {
      await api.delete(`/api/grades/${id}`);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    }
  };

  const pct = (note, sur) => {
    const n = Number(note) || 0;
    const s = Number(sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  };

  const pctChip = (p) => {
    if (p >= 80) return { label: `${p}%`, variant: "outlined" };
    if (p >= 60) return { label: `${p}%`, variant: "outlined" };
    return { label: `${p}%`, variant: "outlined" };
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Notes</Typography>
        </Grid>

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              component={RouterLink}
              to="/print/grades"
            >
              Aperçu liste
            </Button>

            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Ajouter
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Recherche (étudiant, cours, période, note...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Error */}
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
              <TableCell><b>Période</b></TableCell>
              <TableCell><b>Note</b></TableCell>
              <TableCell><b>%</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Aucune note.</TableCell></TableRow>
            ) : (
              filtered.map((g) => {
                const s = g.student || {};
                const c = g.course || {};
                const p = pct(g.note, g.sur);
                const chip = pctChip(p);

                return (
                  <TableRow key={g._id} hover>
                    <TableCell>
                      {s.matricule ? (
                        <span>{s.matricule} • {s.prenom} {s.nom}</span>
                      ) : (
                        <span>{g.studentId || "-"}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {c.code ? (
                        <span>{c.code} • {c.titre}</span>
                      ) : (
                        <span>{g.courseId || "-"}</span>
                      )}
                    </TableCell>

                    <TableCell>{g.periode || "-"}</TableCell>

                    <TableCell>
                      {g.note ?? 0} / {g.sur ?? 100}
                    </TableCell>

                    <TableCell>
                      <Chip size="small" variant={chip.variant} label={chip.label} />
                    </TableCell>

                  <TableCell align="right">
  <Stack direction="row" spacing={1} justifyContent="flex-end">
    <Button
      size="small"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      onClick={() => navigate(`/grades/${g._id}`)}
    >
      Détails
    </Button>

    <Button
      size="small"
      variant="outlined"
      startIcon={<EditIcon />}
      onClick={() => openEdit(g)}
    >
      Modifier
    </Button>

    <Button
      size="small"
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={() => remove(g._id)}
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

      <GradeForm
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
