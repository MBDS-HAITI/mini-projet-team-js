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

const labelStatut = (s) => {
  if (s === "VALIDE") return "Validé";
  if (s === "EN_ATTENTE") return "En attente";
  if (s === "ANNULE") return "Annulé";
  return s || "-";
};

export default function PrintEnrollmentsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/enrollments");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const now = useMemo(() => new Date().toLocaleString(), []);
  const totals = useMemo(() => {
    const total = items.length;
    const valides = items.filter((e) => e.statut === "VALIDE").length;
    const enAttente = items.filter((e) => e.statut === "EN_ATTENTE").length;
    const annulees = items.filter((e) => e.statut === "ANNULE").length;
    return { total, valides, enAttente, annulees };
  }, [items]);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Liste des inscriptions" backTo="/enrollments" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* En-tête aperçu */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
              Liste des inscriptions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aperçu avant impression de l&apos;ensemble des inscriptions enregistrées.
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Résumé */}
          {!loading && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              sx={{ mb: 2, fontSize: 14 }}
            >
              <Typography variant="body2">
                Total : <b>{totals.total}</b> inscription(s)
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  size="small"
                  label={`Validées : ${totals.valides}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`En attente : ${totals.enAttente}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`Annulées : ${totals.annulees}`}
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
            <Typography>Aucune inscription à afficher.</Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Étudiant</b></TableCell>
                    <TableCell><b>Cours</b></TableCell>
                    <TableCell><b>Année</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Statut</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((en) => {
                    const s = en.student || {};
                    const c = en.course || {};
                    const studentLabel = s.matricule
                      ? `${s.matricule} • ${s.prenom} ${s.nom}`
                      : en.studentId || "-";
                    const courseLabel = c.code
                      ? `${c.code} • ${c.titre}`
                      : en.courseId || "-";

                    return (
                      <TableRow key={en._id}>
                        <TableCell>{studentLabel}</TableCell>
                        <TableCell>{courseLabel}</TableCell>
                        <TableCell>{en.anneeAcademique || "-"}</TableCell>
                        <TableCell>
                          {en.dateInscription
                            ? String(en.dateInscription).slice(0, 10)
                            : "-"}
                        </TableCell>
                        <TableCell>{labelStatut(en.statut)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Généré le {now}
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
