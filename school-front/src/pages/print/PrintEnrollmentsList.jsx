import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography
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

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Liste des inscriptions" backTo="/enrollments" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography textAlign={"center"} variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Liste des inscriptions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : (
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
                  const studentLabel = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (en.studentId || "-");
                  const courseLabel = c.code ? `${c.code} • ${c.titre}` : (en.courseId || "-");

                  return (
                    <TableRow key={en._id}>
                      <TableCell>{studentLabel}</TableCell>
                      <TableCell>{courseLabel}</TableCell>
                      <TableCell>{en.anneeAcademique || "-"}</TableCell>
                      <TableCell>{en.dateInscription ? String(en.dateInscription).slice(0, 10) : "-"}</TableCell>
                      <TableCell>{labelStatut(en.statut)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {now}
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
