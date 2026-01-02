import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Typography, MenuItem
} from "@mui/material";

const emptyForm = {
  email: "",
  role: "SCOLARITE",
  studentId: ""
};

const ROLES = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "SCOLARITE", label: "SCOLARITE" },
  { value: "STUDENT", label: "STUDENT" }
];

export default function UserForm({
  open,
  onClose,
  onSubmit,
  saving,
  initialData,
  students = []
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData?._id) {
      setForm({
        email: initialData.email || "",
        role: initialData.role || "SCOLARITE",
        studentId: initialData.student?._id || initialData.studentId || ""
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  const submit = async () => {
    setError("");
    try {
      if (!form.email?.trim()) throw new Error("Email obligatoire.");
      if (!form.email.includes("@")) throw new Error("Email invalide.");
      if (!form.role) throw new Error("Rôle obligatoire.");

      if (form.role === "STUDENT" && !form.studentId) {
        throw new Error("Pour role STUDENT, il faut lier un étudiant.");
      }

      await onSubmit({
        email: form.email.trim().toLowerCase(),
        role: form.role,
        studentId: form.role === "STUDENT" ? form.studentId : null,
        actif: true
      });
    } catch (e) {
      setError(e?.message || "Erreur formulaire");
    }
  };

  const studentLabel = (s) => `${s.matricule} • ${s.prenom} ${s.nom}`;

  return (
    <Dialog open={open} onClose={() => !saving && onClose?.()} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {initialData?._id ? "Modifier utilisateur" : "Ajouter utilisateur"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Email *"
              fullWidth
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Rôle *"
              fullWidth
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {form.role === "STUDENT" && (
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Étudiant lié *"
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
          )}
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
