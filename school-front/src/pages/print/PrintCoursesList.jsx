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
        <PrintToolbar
          title="Aperçu - Liste des cours"
          backTo="/courses"
          className="no-print"
        />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              mb: 2
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 1 }}
              >
                Liste des cours
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                École Polytechnique - Gestion Scolaire
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Généré le {now} • {items.length} cours
                {items.length !== 1 ? "s" : ""} au total
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : (
            <Table
              size="small"
              aria-label="courses-print-table"
              sx={{ mt: 2 }}
            >
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Code
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Titre
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Crédit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Niveau
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Filière
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Statut
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow
                    key={c._id}
                    sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}
                  >
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 500 }}>
                      {c.code}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{c.titre}</TableCell>
                    <TableCell>{c.credit ?? 0}</TableCell>
                    <TableCell>{c.niveau || "-"}</TableCell>
                    <TableCell>{c.filiere || "-"}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: c.actif ? "success.main" : "error.main"
                        }}
                      >
                        {c.actif ? "Actif" : "Inactif"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      {c.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #ccc" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Document généré automatiquement par le système de gestion scolaire • {now}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 1 }}
            >
              École Polytechnique - Service Scolarité
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
