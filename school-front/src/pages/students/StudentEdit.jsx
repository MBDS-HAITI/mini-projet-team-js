import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Fade,
  useTheme
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";

import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";

export default function StudentEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const theme = useTheme();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    matricule: "",
    prenom: "",
    nom: "",
    email: "",
    niveau: "",
    filiere: "",
    actif: true
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/students/${id}`);
      const data = res.data;
      setStudent(data);
      setForm({
        matricule: data.matricule || "",
        prenom: data.prenom || "",
        nom: data.nom || "",
        email: data.email || "",
        niveau: data.niveau || "",
        filiere: data.filiere || "",
        actif: data.actif ?? true
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement étudiant");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (field) => (event) => {
    setForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSwitchChange = (event) => {
    setForm(prev => ({
      ...prev,
      actif: event.target.checked
    }));
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put(`/api/students/${id}`, form);
      setSuccess("Étudiant modifié avec succès !");
      setTimeout(() => {
        nav(`/students/${id}`);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0B1220 0%, #111A2E 100%)'
          : 'linear-gradient(135deg, #F6F7FB 0%, #FFFFFF 100%)',
        p: { xs: 2, md: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

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
            background: 'linear-gradient(90deg, #FF9800, #FFC107, #FF9800)',
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
                  <PersonIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #FF9800, #FFC107)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5
                      }}
                    >
                      Modifier l'Étudiant
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student ? `${student.prenom} ${student.nom}` : 'Chargement...'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md="auto">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => nav(`/students/${id}`)}
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
                  Annuler
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Messages */}
      <Fade in={!!error} timeout={500}>
        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Fade in={!!success} timeout={500}>
        <Box>
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Form */}
      <Fade in={true} timeout={800}>
        <Card sx={{
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}>
              Informations de l'étudiant
            </Typography>

            <Grid container spacing={4}>
              {/* Matricule */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <BadgeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Matricule"
                    value={form.matricule}
                    onChange={handleChange('matricule')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Prénom */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Prénom"
                    value={form.prenom}
                    onChange={handleChange('prenom')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Nom */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Nom"
                    value={form.nom}
                    onChange={handleChange('nom')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Niveau */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SchoolIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Niveau"
                    value={form.niveau}
                    onChange={handleChange('niveau')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Filière */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SchoolIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <TextField
                    fullWidth
                    label="Filière"
                    value={form.filiere}
                    onChange={handleChange('filiere')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Statut actif */}
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Statut de l'étudiant
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Désactiver pour rendre l'étudiant inactif
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.actif}
                        onChange={handleSwitchChange}
                        color="primary"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.08)'
                            }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'primary.main'
                          }
                        }}
                      />
                    }
                    label={form.actif ? "Actif" : "Inactif"}
                    labelPlacement="start"
                  />
                </Box>
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => nav(`/students/${id}`)}
                    disabled={saving}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      minWidth: 120
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={submit}
                    disabled={saving}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      minWidth: 120,
                      background: 'linear-gradient(45deg, #FF9800, #FFC107)',
                      boxShadow: '0 4px 14px rgba(255, 152, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #F57C00, #FF9800)',
                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                      },
                      '&:disabled': {
                        background: 'grey.400',
                        color: 'grey.600'
                      }
                    }}
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}