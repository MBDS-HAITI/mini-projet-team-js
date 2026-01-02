import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Typography, MenuItem, Stack, Divider
} from "@mui/material";

const emptyForm = {
  studentId: "",
  courseId: "",
  note: 0,
  sur: 100,
  periode: "Semestre 1",
  remarque: ""
};

export default function GradeForm({
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
        note: initialData.note ?? 0,
        sur: initialData.sur ?? 100,
        periode: initialData.periode ?? "Semestre 1",
        remarque: initialData.remarque ?? ""
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  const pct = useMemo(() => {
    const n = Number(form.note) || 0;
    const s = Number(form.sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  }, [form.note, form.sur]);

  const submit = async () => {
    setError("");
    try {
      if (!form.studentId) throw new Error("Étudiant obligatoire.");
      if (!form.courseId) throw new Error("Cours obligatoire.");
      if (Number(form.sur) <= 0) throw new Error("Le champ 'Sur' doit être > 0.");
      if (Number(form.note) < 0) throw new Error("La note doit être >= 0.");
      if (Number(form.note) > Number(form.sur)) throw new Error("La note ne peut pas dépasser 'Sur'.");

      await onSubmit({
        studentId: form.studentId,
        courseId: form.courseId,
        note: Number(form.note),
        sur: Number(form.sur),
        periode: form.periode?.trim() || "Semestre 1",
        remarque: form.remarque?.trim() || ""
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
        {initialData?._id ? "Modifier la note" : "Ajouter une note"}
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

          <Grid item xs={12} sm={4}>
            <TextField
              label="Note *"
              type="number"
              fullWidth
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Sur *"
              type="number"
              fullWidth
              value={form.sur}
              onChange={(e) => setForm((p) => ({ ...p, sur: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="%" fullWidth value={`${pct}%`} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Période"
              fullWidth
              value={form.periode}
              onChange={(e) => setForm((p) => ({ ...p, periode: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Remarque"
              fullWidth
              multiline
              minRows={2}
              value={form.remarque}
              onChange={(e) => setForm((p) => ({ ...p, remarque: e.target.value }))}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Règle: note ≤ sur
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {pct}%
          </Typography>
        </Stack>

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
