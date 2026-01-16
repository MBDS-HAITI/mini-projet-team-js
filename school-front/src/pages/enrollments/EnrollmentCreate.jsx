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
  MenuItem,
  useTheme,
  Autocomplete
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

import { useNavigate } from "react-router-dom";
import { api } from "../../api/http";

const STATUTS = [
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Validé" },
  { value: "ANNULE", label: "Annulé" }
];

export default function EnrollmentCreate() {
  const nav = useNavigate();
  const theme = useTheme();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    anneeAcademique: "2025-2026",
    statut: "VALIDE",
    dateInscription: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      setError("");
      try {
        const [st, co] = await Promise.all([
          api.get("/api/students"),
          api.get("/api/courses")
        ]);
        setStudents(st.data || []);
        setCourses(co.data || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Erreur chargement des données");
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.studentId) return "L'étudiant est obligatoire";
    if (!form.courseId) return "Le cours est obligatoire";
    if (!form.anneeAcademique?.trim()) return "L'année académique est obligatoire";
    if (!form.dateInscription) return "La date d'inscription est obligatoire";
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
      await api.post("/api/enrollments", {
        studentId: form.studentId,
        courseId: form.courseId,
        anneeAcademique: form.anneeAcademique.trim(),
        statut: form.statut,
        dateInscription: form.dateInscription,
        actif: true
      });

      setSuccess("Inscription créée avec succès !");
      setTimeout(() => {
        nav("/enrollments");
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  const studentLabel = (s) => (s ? `${s.prenom} ${s.nom} (${s.matricule})` : "");
  const courseLabel = (c) => (c ? `${c.titre} (${c.code})` : "");

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => nav("/enrollments")}
          sx={{
            mb: 2,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Retour à la liste
        </Button>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196F3, #21CBF3)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Nouvelle inscription
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Créer une nouvelle inscription pour un étudiant
        </Typography>
      </Box>

      {/* Success */}
      <Fade in={!!success} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2, mb: 3 }}>
              {success}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Error */}
      <Fade in={!!error} timeout={500}>
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden",
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
                gap: 1,
              }}
            >
              <SchoolIcon />
              Informations d'inscription
            </Typography>

             <Grid container spacing={3}>
               <Grid item xs={12} md={6} sx={{ minWidth: { md: 320, xs: '100%' } }}>
                 <Autocomplete
                   fullWidth
                   options={students}
                   getOptionLabel={studentLabel}
                   value={students.find((s) => s._id === form.studentId) || null}
                   onChange={(event, value) =>
                     setForm((prev) => ({
                       ...prev,
                       studentId: value?._id || "",
                     }))
                   }
                   loading={loadingData}
                   disabled={saving || loadingData}
                   renderInput={(params) => (
                     <TextField
                       {...params}
                       label="Étudiant *"
                       required
                       InputProps={{
                         ...params.InputProps,
                         startAdornment: (
                           <>
                             <PersonIcon
                               sx={{ mr: 1, color: "action.active" }}
                             />
                             {params.InputProps.startAdornment}
                           </>
                         ),
                       }}
                       sx={{
                         minWidth: 300,
                         "& .MuiOutlinedInput-root": {
                           borderRadius: 2,
                         },
                         "& .MuiAutocomplete-input": {
                           whiteSpace: 'normal',
                           textOverflow: 'unset',
                         },
                       }}
                     />
                   )}
                 />
               </Grid>

               <Grid item xs={12} md={6} sx={{ minWidth: { md: 320, xs: '100%' } }}>
                 <Autocomplete
                   fullWidth
                   options={courses}
                   getOptionLabel={courseLabel}
                   value={courses.find((c) => c._id === form.courseId) || null}
                   onChange={(event, value) =>
                     setForm((prev) => ({
                       ...prev,
                       courseId: value?._id || "",
                     }))
                   }
                   loading={loadingData}
                   disabled={saving || loadingData}
                   renderInput={(params) => (
                     <TextField
                       {...params}
                       label="Cours *"
                       required
                       InputProps={{
                         ...params.InputProps,
                         startAdornment: (
                           <>
                             <SchoolIcon
                               sx={{ mr: 1, color: "action.active" }}
                             />
                             {params.InputProps.startAdornment}
                           </>
                         ),
                       }}
                       sx={{
                         minWidth: 300,
                         "& .MuiOutlinedInput-root": {
                           borderRadius: 2,
                         },
                         "& .MuiAutocomplete-input": {
                           whiteSpace: 'normal',
                           textOverflow: 'unset',
                         },
                       }}
                     />
                   )}
                 />
               </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Année académique *"
                  value={form.anneeAcademique}
                  onChange={handleChange("anneeAcademique")}
                  required
                  disabled={saving}
                  placeholder="2025-2026"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Statut"
                  value={form.statut}
                  onChange={handleChange("statut")}
                  disabled={saving}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  {STATUTS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date d'inscription *"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.dateInscription}
                  onChange={handleChange("dateInscription")}
                  required
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <EventIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
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
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={saving || loadingData}
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
                      "0 6px 20px rgba(76, 175, 80, 0.4)",
                  },
                  "&:disabled": {
                    background:
                      theme.palette.action.disabledBackground,
                  },
                }}
              >
                {saving ? "Création..." : "Créer l'inscription"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={() => nav("/enrollments")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor:
                      theme.palette.primary.main + "08",
                  },
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
