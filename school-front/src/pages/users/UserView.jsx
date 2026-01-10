import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";

export default function UserView() {
  const { id } = useParams();
  const nav = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/users/${id}`);
      // normalize backend: studentId populated -> map to 'student'
      const out = { ...res.data, student: res.data.studentId || null };
      setUser(out);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Détails utilisateur</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => nav(-1)}>Retour</Button>
      </Box>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent><Typography color="error">{error}</Typography></CardContent>
        </Card>
      )}

      {!user ? (
        <Typography>Chargement...</Typography>
      ) : (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">{user.email}</Typography>
                <Typography color="text.secondary">Rôle: {user.role}</Typography>
                <Typography color="text.secondary">Bloqué: {user.blocked ? "Oui" : "Non"}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><b>Etudiant lié :</b> {user.student ? `${user.student.matricule} • ${user.student.prenom} ${user.student.nom}` : "-"}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
