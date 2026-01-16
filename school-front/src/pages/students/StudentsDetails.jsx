import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Stack,
  Fade,
  useTheme
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { api } from "../../api/http";

export default function StudentDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const theme = useTheme();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.get(`/api/students/${id}`).then(res => setStudent(res.data));
  }, [id]);

  if (!student) return null;

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* HEADER */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                Détails de l'Étudiant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualisation complète des informations de l’étudiant
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => nav("/students")}
              >
                Retour
              </Button>

              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                component={RouterLink}
                to={`/print/students/${id}`}
              >
                Imprimer / PDF
              </Button>

              <Button
                variant="contained"
                startIcon={<EditIcon />}
                component={RouterLink}
                to={`/students/${id}/edit`}
              >
                Modifier
              </Button>
            </Stack>
          </Grid>
        </CardContent>
      </Card>

      {/* MAIN CARD – STYLE INSCRIPTION */}
      <Fade in timeout={600}>
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            borderRadius: 3,
            background: "linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* IDENTITÉ */}
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                {student.prenom?.[0]}{student.nom?.[0]}
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {student.matricule} • {student.prenom} {student.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.email}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Chip
                icon={<CheckCircleIcon />}
                label={student.actif ? "Actif" : "Inactif"}
                color={student.actif ? "success" : "default"}
              />
            </Stack>

            {/* INFOS ACADÉMIQUES */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Niveau d'études
                    </Typography>
                    <Chip
                      label={student.niveau || "—"}
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Filière
                    </Typography>
                    <Typography fontWeight={600} sx={{ mt: 1 }}>
                      {student.filiere || "—"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* SYSTEM */}
            <Card sx={{ mt: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Identifiant de l’étudiant
                </Typography>
                <Typography sx={{ fontFamily: "monospace" }}>
                  {student._id}
                </Typography>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}