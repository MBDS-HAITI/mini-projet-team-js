import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Divider, Grid,
  IconButton, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../api/http";
import CourseForm from "./CourseForm";

export default function CoursesList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/courses");
      setItems(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((c) =>
      [c.code, c.titre, c.niveau, c.filiere]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    );
  }, [items, q]);

  const openCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setOpenForm(true);
  };

  const submitForm = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) {
        await api.put(`/api/courses/${editing._id}`, payload);
      } else {
        await api.post("/api/courses", payload);
      }
      setOpenForm(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur sauvegarde");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Supprimer ce cours ?")) return;
    setError("");
    try {
      await api.delete(`/api/courses/${id}`);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Cours</Typography>
        </Grid>

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              component={RouterLink}
              to="/print/courses"
            >
              Aperçu liste
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
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
            label="Recherche (code, titre, niveau, filière...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
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
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Titre</b></TableCell>
              <TableCell><b>Crédit</b></TableCell>
              <TableCell><b>Niveau</b></TableCell>
              <TableCell><b>Filière</b></TableCell>
              <TableCell><b>Statut</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7}>Aucun cours.</TableCell></TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.titre}</TableCell>
                  <TableCell>{c.credit ?? 0}</TableCell>
                  <TableCell>{c.niveau || "-"}</TableCell>
                  <TableCell>{c.filiere || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={c.actif ? "Actif" : "Inactif"}
                    />
                  </TableCell>
                    <TableCell>{c.description || "-"}</TableCell>

                 
                  <TableCell align="right">
  <Stack direction="row" spacing={1} justifyContent="flex-end">
    <Button
      size="small"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      component={RouterLink}
      to={`/courses/${c._id}`}
    >
      Détails
    </Button>

    <Button
      size="small"
      variant="outlined"
      startIcon={<EditIcon />}
      onClick={() => openEdit(c)}
    >
      Modifier
    </Button>

    <Button
      size="small"
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={() => remove(c._id)}
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

      <CourseForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitForm}
        saving={saving}
        initialData={editing}
      />
    </Box>
  );
}
