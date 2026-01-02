import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Typography
} from "@mui/material";

const emptyForm = {
  code: "",
  titre: "",
  credit: 0,
  niveau: "",
  filiere: "",
  description: "",
  actif: true
};

export default function CourseForm({ open, onClose, onSubmit, saving, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        titre: initialData.titre || "",
        credit: initialData.credit ?? 0,
        niveau: initialData.niveau || "",
        filiere: initialData.filiere || "",
        description: initialData.description || "",
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
      if (!form.code?.trim() || !form.titre?.trim()) {
        throw new Error("Code et Titre sont obligatoires.");
      }
      await onSubmit({
        ...form,
        credit: Number(form.credit) || 0
      });
    } catch (e) {
      setError(e?.message || "Erreur formulaire");
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose?.()} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initialData?._id ? "Modifier le cours" : "Ajouter un cours"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Code *"
              fullWidth
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Crédit"
              fullWidth
              type="number"
              value={form.credit}
              onChange={(e) => setForm((p) => ({ ...p, credit: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Titre *"
              fullWidth
              value={form.titre}
              onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Niveau"
              fullWidth
              value={form.niveau}
              onChange={(e) => setForm((p) => ({ ...p, niveau: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Filière"
              fullWidth
              value={form.filiere}
              onChange={(e) => setForm((p) => ({ ...p, filiere: e.target.value }))}
            />
          </Grid>
            <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
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
