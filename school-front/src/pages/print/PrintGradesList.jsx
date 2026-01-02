import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow,
  Typography
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

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Aperçu - Liste des notes" backTo="/grades" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography textAlign={"center"} variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Liste des notes
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
                  <TableCell><b>Période</b></TableCell>
                  <TableCell><b>Note</b></TableCell>
                  <TableCell><b>%</b></TableCell>
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
                        {s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (g.studentId || "-")}
                      </TableCell>
                      <TableCell>
                        {c.code ? `${c.code} • ${c.titre}` : (g.courseId || "-")}
                      </TableCell>
                      <TableCell>{g.periode || "-"}</TableCell>
                      <TableCell>{g.note} / {g.sur}</TableCell>
                      <TableCell>{p}%</TableCell>
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
