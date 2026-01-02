import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Typography, MenuItem
} from "@mui/material";

const emptyForm = {
  studentId: "",
  courseId: "",
  anneeAcademique: "2024-2025",
  statut: "VALIDE",
  dateInscription: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
  actif: true
};

const STATUTS = [
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Validé" },
  { value: "ANNULE", label: "Annulé" }
];

export default function EnrollmentForm({
  open,
  onClose,
  onSubmit,
  saving,
  initialData,
  students = [],
  courses = []
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData?._id) {
      setForm({
        studentId: initialData.student?._id || initialData.studentId || "",
        courseId: initialData.course?._id || initialData.courseId || "",
        anneeAcademique: initialData.anneeAcademique || "2024-2025",
        statut: initialData.statut || "VALIDE",
        dateInscription: initialData.dateInscription
          ? String(initialData.dateInscription).slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        actif: initialData.actif ?? true
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  const submit = async () => {
    setError("");
    try {
      if (!form.studentId) throw new Error("Étudiant obligatoire.");
      if (!form.courseId) throw new Error("Cours obligatoire.");
      if (!form.anneeAcademique?.trim()) throw new Error("Année académique obligatoire.");
      if (!form.dateInscription) throw new Error("Date d’inscription obligatoire.");

      await onSubmit({
        studentId: form.studentId,
        courseId: form.courseId,
        anneeAcademique: form.anneeAcademique.trim(),
        statut: form.statut,
        dateInscription: form.dateInscription,
        actif: true
      });
    } catch (e) {
      setError(e?.message || "Erreur formulaire");
    }
  };

  const studentLabel = (s) => `${s.matricule} • ${s.prenom} ${s.nom}`;
  const courseLabel = (c) => `${c.code} • ${c.titre}`;

  return (
    <Dialog open={open} onClose={() => !saving && onClose?.()} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {initialData?._id ? "Modifier inscription" : "Ajouter inscription"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              select
              label="Étudiant *"
              fullWidth
              value={form.studentId}
              onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
            >
              {students.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {studentLabel(s)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Cours *"
              fullWidth
              value={form.courseId}
              onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))}
            >
              {courses.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {courseLabel(c)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Année académique *"
              fullWidth
              value={form.anneeAcademique}
              onChange={(e) => setForm((p) => ({ ...p, anneeAcademique: e.target.value }))}
              placeholder="2024-2025"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Statut"
              fullWidth
              value={form.statut}
              onChange={(e) => setForm((p) => ({ ...p, statut: e.target.value }))}
            >
              {STATUTS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date inscription *"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dateInscription}
              onChange={(e) => setForm((p) => ({ ...p, dateInscription: e.target.value }))}
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Annuler</Button>
        <Button variant="contained" onClick={submit} disabled={saving}>
          {saving ? "Sauvegarde..." : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
