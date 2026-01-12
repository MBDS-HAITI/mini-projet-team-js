import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintStudentsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/students");
      setItems(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const now = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="print-root">
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <PrintToolbar title="Aperçu - Liste des étudiants" backTo="/students" className="no-print"/>
      <Container maxWidth="md" sx={{ py: 4 }}>
        { <Box sx={{ display: "flex", justifyContent: "center", alignItems: "start", mb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Liste des étudiants</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              École Polytechnique - Gestion Scolaire
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Généré le {now} • {items.length} étudiant{items.length !== 1 ? 's' : ''} au total
            </Typography>
          </Box>
        </Box> }

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Typography>Chargement...</Typography>
        ) : (
          <Table size="small" aria-label="students-print-table" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Matricule</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Nom complet</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Niveau</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Filière</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Statut</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((s, index) => (
                <TableRow key={s._id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{s.matricule}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{s.prenom} {s.nom}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>{s.email}</TableCell>
                  <TableCell>{s.niveau || "-"}</TableCell>
                  <TableCell>{s.filiere || "-"}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: s.actif ? 'success.main' : 'error.main'
                      }}
                    >
                      {s.actif ? "Actif" : "Inactif"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ccc' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Document généré automatiquement par le système de gestion scolaire • {now}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            École Polytechnique - Service Scolarité
          </Typography>
        </Box>
      </Container>
    </Box>
    </div>
  );
}
