import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  TextField,
  Typography
} from "@mui/material";

const emptyForm = {
  matricule: "",
  prenom: "",
  nom: "",
  email: "",
  niveau: "",
  filiere: "",
  actif: true
};

export default function StudentForm({
  open,
  onClose,
  onSubmit,
  saving,
  initialData // si null => create, si student => edit
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData?._id) {
      setForm({
        matricule: initialData.matricule || "",
        prenom: initialData.prenom || "",
        nom: initialData.nom || "",
        email: initialData.email || "",
        niveau: initialData.niveau || "",
        filiere: initialData.filiere || "",
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
      if (!form.matricule || !form.prenom || !form.nom || !form.email) {
        throw new Error("Matricule, prénom, nom, email sont obligatoires.");
      }

      await onSubmit({
        ...form,
        email: form.email.trim()
      });
    } catch (e) {
      setError(e?.message || "Erreur formulaire");
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose?.()} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {initialData?._id ? "Modifier étudiant" : "Ajouter étudiant"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Matricule *"
              fullWidth
              value={form.matricule}
              onChange={(e) => setForm((p) => ({ ...p, matricule: e.target.value }))}
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
              label="Prénom *"
              fullWidth
              value={form.prenom}
              onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Nom *"
              fullWidth
              value={form.nom}
              onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email *"
              fullWidth
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Filière"
              fullWidth
              value={form.filiere}
              onChange={(e) => setForm((p) => ({ ...p, filiere: e.target.value }))}
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
