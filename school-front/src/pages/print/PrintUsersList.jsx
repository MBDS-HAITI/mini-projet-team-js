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

export default function PrintUsersList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useMemo(() => new Date().toLocaleString(), []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setItems(res.data);
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
        <PrintToolbar title="Aperçu - Liste des utilisateurs" backTo="/users" />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Liste des utilisateurs
          </Typography>
        

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Rôle</b></TableCell>
                  <TableCell><b>Étudiant lié</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((u) => {
                  const st = u.student || null;
                  const stLabel = st ? `${st.matricule} • ${st.prenom} ${st.nom}` : "-";

                  return (
                    <TableRow key={u._id}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role || "-"}</TableCell>
                      <TableCell>{stLabel}</TableCell>
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
