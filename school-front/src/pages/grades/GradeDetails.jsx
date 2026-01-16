import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import GradeIcon from "@mui/icons-material/Grade";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";

const pctChipProps = (p) => {
  if (p >= 80) return { color: "success", label: `${p}% (Excellent)` };
  if (p >= 60) return { color: "warning", label: `${p}% (Moyen)` };
  return { color: "error", label: `${p}% (Insuffisant)` };
};

export default function GradeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [g, setG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const gr = await api.get(`/api/grades/${id}`);
      setG(gr.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Note introuvable");
      setG(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const pct = useMemo(() => {
    const n = Number(g?.note) || 0;
    const s = Number(g?.sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  }, [g]);

  const s = g?.student || {};
  const c = g?.course || {};
  const fullName = s.matricule
    ? `${s.matricule} • ${s.prenom} ${s.nom}`
    : g?.studentId || "-";
  const courseName = c.code
    ? `${c.code} • ${c.titre}`
    : g?.courseId || "-";
  const { color: chipColor, label: chipLabel } = pctChipProps(pct);

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
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Détails de la note
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Visualisation complète de la note de l'étudiant pour un cours.
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
            to={`/print/grades/${id}`}
            disabled={!g}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Imprimer / PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/grades/${id}/edit`)}
            disabled={!g}
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
          ) : !g ? (
            <Typography
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              Note introuvable.
            </Typography>
          ) : (
            <>
              {/* En-tête note */}
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
                      {fullName}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SchoolIcon color="secondary" />
                    <Typography variant="body1" color="text.primary">
                      {courseName}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Période : {g.periode || "-"}
                  </Typography>
                </Box>

                <Chip
                  label={chipLabel}
                  color={chipColor}
                  icon={<GradeIcon />}
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
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700 }}
                    >
                      Note obtenue
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "text.primary" }}>
                      {g.note} / {g.sur} ({pct}%)
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
                      Période d'évaluation
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "text.primary" }}>
                      {g.periode || "-"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
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
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Remarque
                    </Typography>
                    <Typography sx={{ color: "text.primary" }}>
                      {g.remarque || "-"}
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
                      Identifiant de la note : {g._id}
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
