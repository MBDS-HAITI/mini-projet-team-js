import React, { useState } from "react";
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

import { useNavigate } from "react-router-dom";
import { api } from "../../api/http";

export default function StudentCreate() {
  const nav = useNavigate();
  const theme = useTheme();
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

  const handleChange = (field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSwitchChange = (field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const validateForm = () => {
    if (!form.matricule.trim()) return "Le matricule est requis";
    if (!form.prenom.trim()) return "Le prénom est requis";
    if (!form.nom.trim()) return "Le nom est requis";
    if (!form.email.trim()) return "L'email est requis";
    if (!form.niveau.trim()) return "Le niveau est requis";
    if (!form.filiere.trim()) return "La filière est requise";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "L'email n'est pas valide";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const _res = await api.post("/api/students", form);

      setSuccess("Étudiant créé avec succès !");
      setTimeout(() => {
        nav("/students");
      }, 1500);

    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => nav("/students")}
          sx={{
            mb: 2,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          Retour à la liste
        </Button>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Nouveau Étudiant
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Ajouter un nouvel étudiant au système
        </Typography>
      </Box>

      {/* Success Message */}
      <Fade in={!!success} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2, mb: 3 }}>
              {success}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Error Message */}
      <Fade in={!!error} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Form */}
      <Card sx={{
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PersonIcon />
              Informations de l'étudiant
            </Typography>

            <Grid container spacing={3}>
              {/* Matricule */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Matricule"
                  value={form.matricule}
                  onChange={handleChange('matricule')}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Prénom */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={form.prenom}
                  onChange={handleChange('prenom')}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Nom */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={form.nom}
                  onChange={handleChange('nom')}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Niveau */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Niveau"
                  value={form.niveau}
                  onChange={handleChange('niveau')}
                  required
                  disabled={saving}
                  placeholder="Ex: L1, L2, L3, M1, M2"
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Filière */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Filière"
                  value={form.filiere}
                  onChange={handleChange('filiere')}
                  required
                  disabled={saving}
                  placeholder="Ex: Informatique, Mathématiques"
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Statut actif */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.actif}
                      onChange={handleSwitchChange('actif')}
                      disabled={saving}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main + '14'
                          }
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: theme.palette.primary.main
                        }
                      }}
                    />
                  }
                  label="Étudiant actif"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'flex-start' }
            }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #4CAF50, #81C784)',
                  boxShadow: '0 4px 14px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C, #66BB6A)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground
                  }
                }}
              >
                {saving ? 'Création...' : 'Créer Étudiant'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={() => nav("/students")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.main + '08'
                  }
                }}
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}