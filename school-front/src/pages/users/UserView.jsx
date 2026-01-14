import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
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
              letterSpacing: 0.5,
              background: "linear-gradient(45deg, #3F51B5, #00BCD4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Détails de l'utilisateur
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualisation complète des informations du compte sélectionné.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => nav(-1)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Retour
        </Button>
      </Stack>

      {error && (
        <Card
          sx={{
            mb: 2,
            border: "2px solid",
            borderColor: "error.main",
          }}
        >
          <CardContent>
            <Typography color="error" sx={{ fontWeight: 700 }}>
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

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
          {!user ? (
            <>
              <Skeleton height={32} width="60%" sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={40} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Identifiant : {user._id}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.95)",
                      boxShadow: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BadgeIcon color="action" />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                      >
                        Rôle
                      </Typography>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={user.role || "-"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.95)",
                      boxShadow: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon color="action" />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                      >
                        Statut du compte
                      </Typography>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={user.blocked ? "Bloqué" : "Actif"}
                        color={user.blocked ? "error" : "success"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.95)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Étudiant lié
                    </Typography>
                    <Typography>
                      {user.student
                        ? `${user.student.matricule} • ${user.student.prenom} ${user.student.nom}`
                        : "Aucun étudiant lié"}
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
