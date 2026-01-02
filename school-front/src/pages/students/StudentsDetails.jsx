import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";

import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { api } from "../../api/http";

export default function StudentDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.get(`/api/students/${id}`);
      setStudent(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement détail");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Détails de l’étudiant
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => nav(-1)}>
            Retour à la liste
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/students/${id}`}
          >
            Imprimer / PDF
          </Button>
        </Box>
      </Box>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main", borderRadius: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {!student ? (
        <Typography>Chargement...</Typography>
      ) : (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 2
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>
                Informations étudiant
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {student.prenom} {student.nom}
                </Typography>
                <Typography color="text.secondary">
                  Matricule : {student.matricule}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><b>Email :</b> {student.email}</Typography>
                <Typography><b>Niveau :</b> {student.niveau || "-"}</Typography>
                <Typography><b>Filière :</b> {student.filiere || "-"}</Typography>
                <Typography><b>Statut :</b> {student.actif ? "Actif" : "Inactif"}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  ID: {student._id}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
