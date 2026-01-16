import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { api } from "../../api/http";
import { AuthContext } from "../../auth/AuthContext";

export default function Profile() {
  const { user, setSession } = useContext(AuthContext);
  const [me, setMe] = useState(user || null);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const [form, setForm] = useState({ name: "", avatar: "" });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confirm: "" });

  const load = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      setMe(res.data.user);
      setForm({ name: res.data.user.name || '', avatar: res.data.user.avatar || '' });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || 'Erreur');
    }
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitProfile = async () => {
    setErr(""); setInfo("");
    try {
      const res = await api.put('/api/auth/me', form);
      const token = localStorage.getItem('token');
      // update session user
      setSession({ token, user: res.data.user });
      setInfo('Profil mis à jour.');
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || 'Erreur mise à jour');
    }
  };

  const submitPassword = async () => {
    setErr(""); setInfo("");
    if (!pw.newPassword || pw.newPassword.length < 6) return setErr('Nouveau mot de passe trop court (>=6).');
    if (pw.newPassword !== pw.confirm) return setErr('Les mots de passe ne correspondent pas.');

    try {
      const res = await api.post('/api/auth/change-password', { oldPassword: pw.oldPassword || undefined, newPassword: pw.newPassword });
      setInfo(res.data.message || 'Mot de passe mis à jour');
      setPw({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || 'Erreur changement mot de passe');
    }
  };

  if (!me) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Mon profil</Typography>

      {err && <Card sx={{ mb: 2, border: '1px solid', borderColor: 'error.main' }}><CardContent><Typography color="error">{err}</Typography></CardContent></Card>}
      {info && <Card sx={{ mb: 2, border: '1px solid', borderColor: 'success.main' }}><CardContent><Typography color="success.main">{info}</Typography></CardContent></Card>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Informations</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={me.email} disabled sx={{ mb: 2 }} />
              <TextField fullWidth label="Rôle" value={me.role} disabled sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nom" value={form.name} onChange={(e)=>setForm((p)=>({ ...p, name: e.target.value }))} sx={{ mb:2 }} />
              <TextField fullWidth label="Avatar URL" value={form.avatar} onChange={(e)=>setForm((p)=>({ ...p, avatar: e.target.value }))} sx={{ mb:2 }} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 1 }}>
            <Button variant="contained" onClick={submitProfile}>Enregistrer</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Changer le mot de passe</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Ancien mot de passe" type="password" value={pw.oldPassword} onChange={(e)=>setPw((p)=>({ ...p, oldPassword: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Nouveau mot de passe" type="password" value={pw.newPassword} onChange={(e)=>setPw((p)=>({ ...p, newPassword: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Confirmer" type="password" value={pw.confirm} onChange={(e)=>setPw((p)=>({ ...p, confirm: e.target.value }))} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={submitPassword}>Changer le mot de passe</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
