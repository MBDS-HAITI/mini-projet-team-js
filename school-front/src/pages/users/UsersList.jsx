import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Grid, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../../api/http";

export default function UsersList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/users");
      const data = res.data;

      // ✅ assure que items est un tableau
      setItems(Array.isArray(data) ? data : (data?.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement users");
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

    return items.filter((u) => {
      const values = [u.email, u.role, u.studentId].filter(Boolean);
      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Utilisateurs</Typography>
        </Grid>

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Ajouter
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Recherche (email, rôle...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardContent>
      </Card>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Rôle</b></TableCell>
              <TableCell><b>StudentId</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3}>Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={3}>Aucun user.</TableCell></TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip size="small" variant="outlined" label={u.role} />
                  </TableCell>
                  <TableCell>{u.studentId || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
