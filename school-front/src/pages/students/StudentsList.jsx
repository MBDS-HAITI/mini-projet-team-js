import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";

import { api } from "../../api/http";
import { Link as RouterLink } from "react-router-dom";
import StudentForm from "./StudentForm";

export default function StudentsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/students");
      setItems(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement étudiants");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((s) =>
      [s.matricule, s.prenom, s.nom, s.email, s.niveau, s.filiere]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    );
  }, [items, q]);

  const openCreate = () => {
    setError("");
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (s) => {
    setError("");
    setEditing(s);
    setOpenForm(true);
  };

  const submitForm = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) await api.put(`/api/students/${editing._id}`, payload);
      else await api.post("/api/students", payload);

      setOpenForm(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cet étudiant ? (ADMIN seulement)")) return;
    setError("");
    try {
      await api.delete(`/api/students/${id}`);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title + actions */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Étudiants
          </Typography>
        </Grid>

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              component={RouterLink}
              to="/print/students"
            >
              Imprimer / PDF
            </Button>

            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Nouveau
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Search bar */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Rechercher (matricule, nom, email...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outlined" startIcon={<SearchIcon />}>
            Rechercher
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main", borderRadius: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Matricule</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Niveau</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Filière</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7}>Aucun étudiant.</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s._id} hover>
                  <TableCell>{s.matricule}</TableCell>
                  <TableCell>{s.prenom} {s.nom}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.niveau || "-"}</TableCell>
                  <TableCell>{s.filiere || "-"}</TableCell>
                  <TableCell>
                    <Chip label={s.actif ? "Actif" : "Inactif"} size="small" variant="outlined" />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        component={RouterLink}
                        to={`/students/${s._id}`}
                      >
                        Détails
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => openEdit(s)}
                      >
                        Modifier
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => remove(s._id)}
                      >
                        Supprimer
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Dialog séparé */}
      <StudentForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitForm}
        saving={saving}
        initialData={editing}
      />
    </Box>
  );
}
