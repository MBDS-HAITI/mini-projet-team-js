import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";

const statutChip = (statut) => {
  if (statut === "VALIDE") return { label: "Validé", color: "success" };
  if (statut === "EN_ATTENTE") return { label: "En attente", color: "warning" };
  if (statut === "ANNULE") return { label: "Annulé", color: "error" };
  return { label: statut || "-", color: "default" };
};

export default function EnrollmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [en, setEn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/enrollments/${id}`);
      setEn(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Inscription introuvable");
      setEn(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const s = en?.student || {};
  const c = en?.course || {};
  const studentLabel = s.matricule ? `${s.matricule} • ${s.prenom} ${s.nom}` : (en?.studentId || "-");
  const courseLabel = c.code ? `${c.code} • ${c.titre}` : (en?.courseId || "-");
  const chip = statutChip(en?.statut);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Top actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: 1,
              background: "linear-gradient(45deg, #2196F3, #21CBF3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Détails de l'inscription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualisation complète des informations de l'inscription sélectionnée.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Retour
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            component={RouterLink}
            to={`/print/enrollments/${id}`}
            disabled={!en}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/enrollments/${id}/edit`}
            disabled={!en}
            sx={{ borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
          >
            Modifier
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Card
          sx={{
            mb: 2,
            border: "2px solid",
            borderColor: "error.main",
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography color="error" sx={{ fontWeight: 700 }}>
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          boxShadow: 4,
          background:
            "linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 40%, #c3cfe2 100%)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <>
              <Skeleton height={38} width="40%" sx={{ mb: 1 }} />
              <Skeleton height={28} width="30%" sx={{ mb: 2 }} />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={30} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : !en ? (
            <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
              Inscription introuvable.
            </Typography>
          ) : (
            <>
              {/* En-tête inscription */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 3 }}
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <PersonIcon color="primary" />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "primary.dark" }}
                    >
                      {studentLabel}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SchoolIcon color="secondary" />
                    <Typography variant="body1" color="text.primary">
                      {courseLabel}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Année académique : {en.anneeAcademique || "-"}
                  </Typography>
                </Box>

                <Chip
                  label={chip.label}
                  color={chip.color}
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Détails structurés */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      boxShadow: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon color="action" />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                      >
                        Date d'inscription
                      </Typography>
                    </Stack>
                    <Typography sx={{ mt: 0.5, color: "text.primary" }}>
                      {en.dateInscription
                        ? String(en.dateInscription).slice(0, 10)
                        : "-"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700 }}
                    >
                      Statut de l'inscription
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "text.primary" }}>
                      {chip.label}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Identifiant de l'inscription : {en._id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
