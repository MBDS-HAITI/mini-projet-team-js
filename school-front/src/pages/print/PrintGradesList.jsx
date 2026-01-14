import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintGradesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/grades");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const now = useMemo(() => new Date().toLocaleString(), []);

  const pct = (note, sur) => {
    const n = Number(note) || 0;
    const s = Number(sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  };

  const stats = useMemo(() => {
    const total = items.length;
    let excellentes = 0;
    let moyennes = 0;
    let insuffisantes = 0;

    items.forEach((g) => {
      const p = pct(g.note, g.sur);
      if (p >= 80) excellentes += 1;
      else if (p >= 60) moyennes += 1;
      else insuffisantes += 1;
    });

    return { total, excellentes, moyennes, insuffisantes };
  }, [items]);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Liste des notes" backTo="/grades" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* En-tête */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
              Liste des notes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aperçu avant impression de l&apos;ensemble des notes enregistrées.
            </Typography>
            {!loading && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Généré le {now} • {stats.total} note{stats.total > 1 ? "s" : ""} au total
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Résumé */}
          {!loading && stats.total > 0 && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              sx={{ mb: 2, fontSize: 14 }}
            >
              <Typography variant="body2">
                Total : <b>{stats.total}</b> note{stats.total > 1 ? "s" : ""}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  size="small"
                  label={`≥ 80% : ${stats.excellentes}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`60% - 79% : ${stats.moyennes}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`< 60% : ${stats.insuffisantes}`}
                  color="error"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          )}

          {/* Tableau principal */}
          {loading ? (
            <Typography>Chargement...</Typography>
          ) : items.length === 0 ? (
            <Typography>Aucune note à afficher.</Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Étudiant</b>
                    </TableCell>
                    <TableCell>
                      <b>Cours</b>
                    </TableCell>
                    <TableCell>
                      <b>Période</b>
                    </TableCell>
                    <TableCell>
                      <b>Note</b>
                    </TableCell>
                    <TableCell>
                      <b>%</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((g) => {
                    const s = g.student || {};
                    const c = g.course || {};
                    const p = pct(g.note, g.sur);

                    return (
                      <TableRow key={g._id}>
                        <TableCell>
                          {s.matricule
                            ? `${s.matricule} • ${s.prenom} ${s.nom}`
                            : g.studentId || "-"}
                        </TableCell>
                        <TableCell>
                          {c.code
                            ? `${c.code} • ${c.titre}`
                            : g.courseId || "-"}
                        </TableCell>
                        <TableCell>{g.periode || "-"}</TableCell>
                        <TableCell>
                          {g.note} / {g.sur}
                        </TableCell>
                        <TableCell>{p}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Document généré automatiquement par le système de gestion scolaire.
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
