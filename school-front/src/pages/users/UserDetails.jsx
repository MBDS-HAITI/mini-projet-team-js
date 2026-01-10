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
import UserForm from "./UserForm";

const roleChip = (role) => ({ label: role || "-", variant: "outlined" });

export default function UsersList() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);

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
      const [u, s] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/students")
      ]);
      setItems(u.data);
      setStudents(s.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((u) => {
      const st = u.student || {};
      const values = [
        u.email, u.role,
        st.matricule, st.prenom, st.nom
      ].filter(Boolean);
      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const openCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setOpenForm(true);
  };

  const submitForm = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) await api.put(`/api/users/${editing._id}`, payload);
      else await api.post("/api/users", payload);

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
    if (!confirm("Supprimer cet utilisateur ?")) return;
    setError("");
    try {
      await api.delete(`/api/users/${id}`);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
       

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              component={RouterLink}
              to="/print/users"
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
            label="Recherche (email, rôle, étudiant...)"
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
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Rôle</b></TableCell>
              <TableCell><b>Étudiant lié</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4}>Aucun utilisateur.</TableCell></TableRow>
            ) : (
              filtered.map((u) => {
                const chip = roleChip(u.role);
                const st = u.student || null;
                const stLabel = st ? `${st.matricule} • ${st.prenom} ${st.nom}` : "-";

                return (
                  <TableRow key={u._id} hover>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip size="small" variant={chip.variant} label={chip.label} />
                    </TableCell>
                    <TableCell>{stLabel}</TableCell>

                    <TableCell align="right">
                      <IconButton title="Détails" onClick={() => navigate(`/users/${u._id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton title="Modifier" onClick={() => openEdit(u)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton title="Supprimer" onClick={() => remove(u._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={openForm}
        onClose={() => !saving && setOpenForm(false)}
        onSubmit={submitForm}
        saving={saving}
        initialData={editing}
        students={students}
      />
    </Box>
  );
}
