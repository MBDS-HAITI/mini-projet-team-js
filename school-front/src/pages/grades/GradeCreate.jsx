import React, { useEffect, useMemo, useState } from "react";
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
  Autocomplete,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import GradeIcon from "@mui/icons-material/Grade";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

import { useNavigate } from "react-router-dom";
import { api } from "../../api/http";

const emptyForm = {
  studentId: "",
  courseId: "",
  note: 0,
  sur: 100,
  periode: "Semestre 1",
  remarque: "",
};

export default function GradeCreate() {
  const nav = useNavigate();
  const theme = useTheme();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      setError("");
      try {
        const [st, co] = await Promise.all([
          api.get("/api/students"),
          api.get("/api/courses"),
        ]);
        setStudents(st.data || []);
        setCourses(co.data || []);
      } catch (e) {
        setError(
          e?.response?.data?.message || "Erreur chargement des données pour les notes"
        );
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

  const pct = useMemo(() => {
    const n = Number(form.note) || 0;
    const s = Number(form.sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  }, [form.note, form.sur]);

  const validateForm = () => {
    if (!form.studentId) return "L'étudiant est obligatoire";
    if (!form.courseId) return "Le cours est obligatoire";
    if (Number(form.sur) <= 0) return "Le champ 'Sur' doit être > 0";
    if (Number(form.note) < 0) return "La note doit être >= 0";
    if (Number(form.note) > Number(form.sur))
      return "La note ne peut pas dépasser 'Sur'";
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
      await api.post("/api/grades", {
        studentId: form.studentId,
        courseId: form.courseId,
        note: Number(form.note),
        sur: Number(form.sur),
        periode: form.periode?.trim() || "Semestre 1",
        remarque: form.remarque?.trim() || "",
      });

      setSuccess("Note créée avec succès !");
      setTimeout(() => {
        nav("/grades");
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la création de la note");
    } finally {
      setSaving(false);
    }
  };

  const studentLabel = (s) =>
    s ? `${s.nom} ${s.prenom} (${s.matricule})` : "";

  const courseLabel = (c) => (c ? `${c.titre} (${c.code})` : "");

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => nav("/grades")}
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
          Nouvelle note
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Enregistrer une nouvelle note pour un étudiant dans un cours.
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
              <GradeIcon />
              Informations de la note
            </Typography>

            <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{ minWidth: { md: 320, xs: "100%" } }}>
        <Autocomplete
          fullWidth
          options={students}
          getOptionLabel={studentLabel}
          value={
          students.find((s) => s._id === form.studentId) || null
          }
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
              <PersonIcon sx={{ mr: 1, color: "action.active" }} />
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
              whiteSpace: "normal",
              textOverflow: "unset",
            },
            }}
          />
          )}
        />
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: { md: 320, xs: "100%" } }}>
        <Autocomplete
          fullWidth
          options={courses}
          getOptionLabel={courseLabel}
          value={
          courses.find((c) => c._id === form.courseId) || null
          }
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
              <SchoolIcon sx={{ mr: 1, color: "action.active" }} />
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
              whiteSpace: "normal",
              textOverflow: "unset",
            },
            }}
          />
          )}
        />
        </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Note *"
                  type="number"
                  fullWidth
                  value={form.note}
                  onChange={handleChange("note")}
                  disabled={saving}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Sur *"
                  type="number"
                  fullWidth
                  value={form.sur}
                  onChange={handleChange("sur")}
                  disabled={saving}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="%"
                  fullWidth
                  value={`${pct}%`}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Période"
                  fullWidth
                  value={form.periode}
                  onChange={handleChange("periode")}
                  disabled={saving}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Remarque"
                  fullWidth
                  multiline
                  minRows={2}
                  value={form.remarque}
                  onChange={handleChange("remarque")}
                  disabled={saving}
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
                  background: "linear-gradient(45deg, #4CAF50, #81C784)",
                  boxShadow: "0 4px 14px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #388E3C, #66BB6A)",
                    boxShadow:
                      "0 6px 20px rgba(76, 175, 80, 0.4)",
                  },
                  "&:disabled": {
                    background: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {saving ? "Création..." : "Créer la note"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={() => nav("/grades")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}08`,
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
