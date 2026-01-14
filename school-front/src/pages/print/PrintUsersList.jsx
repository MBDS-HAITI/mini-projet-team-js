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
} from "@mui/material";

import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

export default function PrintUsersList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = useMemo(() => new Date().toLocaleString(), []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      // normaliser: backend renvoie studentId peuplé
      setItems(res.data.map((x) => ({ ...x, student: x.studentId || null })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar
          title="Aperçu - Liste des utilisateurs"
          backTo="/users"
          className="no-print"
        />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 1 }}
              >
                Liste des utilisateurs
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                École Polytechnique - Gestion Scolaire
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Généré le {now} • {items.length} utilisateur
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
              aria-label="users-print-table"
              sx={{ mt: 2 }}
            >
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #000",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #000",
                    }}
                  >
                    Rôle
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #000",
                    }}
                  >
                    Étudiant lié
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderBottom: "2px solid #000",
                    }}
                  >
                    Statut
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((u) => {
                  const st = u.student || null;
                  const stLabel = st
                    ? `${st.matricule} • ${st.prenom} ${st.nom}`
                    : "-";

                  return (
                    <TableRow
                      key={u._id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                      }}
                    >
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role || "-"}</TableCell>
                      <TableCell>{stLabel}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: u.blocked ? "error.main" : "success.main",
                          }}
                        >
                          {u.blocked ? "Bloqué" : "Actif"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
