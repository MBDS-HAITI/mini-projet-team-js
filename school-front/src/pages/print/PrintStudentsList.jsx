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
      setItems(res.data);
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
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Liste des étudiants</Typography>
            {/* <Typography variant="body2" color="text.secondary">
              Aperçu avant impression • {now}
            </Typography> */}
          </Box>

          {/* <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
            Imprimer
          </Button> */}
        </Box> }

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Typography>Chargement...</Typography>
        ) : (
          <Table size="small" aria-label="students-print-table">
            <TableHead>
              <TableRow>
                <TableCell><b>Matricule</b></TableCell>
                <TableCell><b>Nom complet</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Niveau</b></TableCell>
                <TableCell><b>Filière</b></TableCell>
                <TableCell><b>Actif</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.matricule}</TableCell>
                  <TableCell>{s.prenom} {s.nom}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.niveau || "-"}</TableCell>
                  <TableCell>{s.filiere || "-"}</TableCell>
                  <TableCell>{s.actif ? "Oui" : "Non"}</TableCell>
                </TableRow>
              ))}
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
