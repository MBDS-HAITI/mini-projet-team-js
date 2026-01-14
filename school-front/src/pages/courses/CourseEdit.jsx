import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  Fade,
  useTheme
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import GradeIcon from "@mui/icons-material/Grade";

import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";

export default function CourseEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    code: "",
    titre: "",
    credit: 0,
    niveau: "",
    filiere: "",
    description: "",
    actif: true
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/courses/${id}`);
      const c = res.data;
      setForm({
        code: c.code || "",
        titre: c.titre || "",
        credit: c.credit ?? 0,
        niveau: c.niveau || "",
        filiere: c.filiere || "",
        description: c.description || "",
        actif: c.actif ?? true
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!form.code.trim()) return "Le code est requis";
    if (!form.titre.trim()) return "Le titre est requis";
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
      await api.put(`/api/courses/${id}`, {
        ...form,
        credit: Number(form.credit) || 0
      });
      setSuccess("Cours modifié avec succès !");
      setTimeout(() => {
        nav(`/courses/${id}`);
      }, 1200);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la modification du cours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Typography>Chargement du cours...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => nav("/courses")}
          sx={{
            mb: 2,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          Retour au cours
        </Button>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1
          }}
        >
          Modifier le Cours
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Mettre à jour les informations du cours
        </Typography>
      </Box>

      {/* Messages */}
      <Fade in={!!error} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Fade in={!!success} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {success}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Form */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <SchoolIcon />
              Informations du cours
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Code *"
                  value={form.code}
                  onChange={handleChange("code")}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <GradeIcon sx={{ mr: 1, color: "action.active" }} />
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Crédit"
                  type="number"
                  value={form.credit}
                  onChange={handleChange("credit")}
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <CreditScoreIcon
                        sx={{ mr: 1, color: "action.active" }}
                      />
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre *"
                  value={form.titre}
                  onChange={handleChange("titre")}
                  required
                  disabled={saving}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Niveau"
                  value={form.niveau}
                  onChange={handleChange("niveau")}
                  disabled={saving}
                  placeholder="Ex: L1, L2, M1, M2"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Filière"
                  value={form.filiere}
                  onChange={handleChange("filiere")}
                  disabled={saving}
                  placeholder="Ex: Informatique, Mathématiques"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  minRows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  disabled={saving}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" }
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background:
                    "linear-gradient(45deg, #4CAF50, #81C784)",
                  boxShadow:
                    "0 4px 14px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #388E3C, #66BB6A)",
                    boxShadow:
                      "0 6px 20px rgba(76, 175, 80, 0.4)"
                  },
                  "&:disabled": {
                    background: theme.palette.action.disabledBackground
                  }
                }}
              >
                {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={() => nav("/courses")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
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
