import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow,
  Typography
} from "@mui/material";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintCoursesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/courses");
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
        <PrintToolbar title="Aperçu - Liste des cours" backTo="/courses" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography textAlign={"center"} variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Liste des cours
          </Typography>
         

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Code</b></TableCell>
                  <TableCell><b>Titre</b></TableCell>
                  <TableCell><b>Crédit</b></TableCell>
                  <TableCell><b>Niveau</b></TableCell>
                  <TableCell><b>Filière</b></TableCell>
                  <TableCell><b>Actif</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.code}</TableCell>
                    <TableCell>{c.titre}</TableCell>
                    <TableCell>{c.credit ?? 0}</TableCell>
                    <TableCell>{c.niveau || "-"}</TableCell>
                    <TableCell>{c.filiere || "-"}</TableCell>
                    <TableCell>{c.actif ? "Oui" : "Non"}</TableCell>
                    <TableCell>{c.description || "-"}</TableCell>
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
