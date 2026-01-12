import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Avatar,
  Chip,
  Skeleton,
  Stack,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { api } from "../../api/http";

export default function StudentDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/students/${id}`);
      setStudent(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement détail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0B1220 0%, #111A2E 100%)'
        : 'linear-gradient(135deg, #F6F7FB 0%, #FFFFFF 100%)',
      p: { xs: 2, md: 3 }
    }}>
      {/* Header Section */}
      <Fade in={true} timeout={600}>
        <Card sx={{
          mb: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1A2332 0%, #111A2E 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite'
          },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md="auto">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)'
                  }}>
                    <PersonIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5
                      }}
                    >
                      Détails de l'Étudiant
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Informations complètes et académiques
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md="auto">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => nav('/students')}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    Retour à la liste
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    to={`/students/${id}/edit`}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      borderColor: 'warning.main',
                      color: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.dark',
                        bgcolor: 'warning.main',
                        color: 'white'
                      }
                    }}
                  >
                    Modifier
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    component={RouterLink}
                    to={`/print/students/${id}`}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #00BCD4)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                      }
                    }}
                  >
                    Imprimer / PDF
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Error Message */}
      <Fade in={!!error} timeout={500}>
        <Box>
          {error && (
            <Card sx={{
              mb: 3,
              border: "2px solid",
              borderColor: "error.main",
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(244, 67, 54, 0.1)'
                : 'rgba(244, 67, 54, 0.05)'
            }}>
              <CardContent sx={{ py: 2 }}>
                <Typography color="error.main" sx={{ fontWeight: 500 }}>
                  ⚠️ {error}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>

      {/* Student Information Cards */}
      {loading ? (
        <Fade in={true} timeout={800}>
          <Grid container spacing={3}>
            {/* Profile Card Skeleton */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={120} height={120} />
                    <Skeleton variant="text" width={150} height={32} />
                    <Skeleton variant="text" width={100} height={24} />
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Details Cards Skeleton */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Skeleton variant="text" width={120} height={20} />
                          <Skeleton variant="text" width={180} height={24} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width={250} height={20} />
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Fade>
      ) : student ? (
        <Fade in={true} timeout={800}>
          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                borderRadius: 3,
                height: '100%',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1A2332 0%, #111A2E 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.3)'
                  : '0 8px 32px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar sx={{
                    width: 120,
                    height: 120,
                    bgcolor: student.actif ? 'primary.main' : 'grey.500',
                    fontSize: '3rem',
                    fontWeight: 700,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)'
                  }}>
                    {student.prenom?.[0]}{student.nom?.[0]}
                  </Avatar>

                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {student.prenom} {student.nom}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                    {student.matricule}
                  </Typography>

                  <Chip
                    label={student.actif ? "Actif" : "Inactif"}
                    color={student.actif ? "success" : "default"}
                    variant={student.actif ? "filled" : "outlined"}
                    icon={student.actif ? <CheckCircleIcon /> : <CancelIcon />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem'
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Details Cards */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Personal Information */}
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.2)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Informations Personnelles
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <BadgeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              Matricule
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {student.matricule}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <AccountCircleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              Nom complet
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {student.prenom} {student.nom}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              Adresse email
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.2)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                      <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Informations Académiques
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                            Niveau d'études
                          </Typography>
                          <Chip
                            label={student.niveau || "Non défini"}
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              px: 2,
                              py: 0.5
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                            Filière
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {student.filiere || "Non définie"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                            Statut académique
                          </Typography>
                          <Chip
                            label={student.actif ? "Étudiant actif" : "Étudiant inactif"}
                            color={student.actif ? "success" : "warning"}
                            variant="filled"
                            icon={student.actif ? <CheckCircleIcon /> : <CancelIcon />}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              px: 2,
                              py: 0.5
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.2)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.02)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary' }}>
                      Informations Système
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      ID unique: {student._id}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Fade>
      ) : null}
    </Box>
  );
}
