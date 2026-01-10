import React, { useState } from "react";
import { Box, Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import { api } from "../../api/http";

export default function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState(""); // optionnel
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const payload = {
        email,
        role,
        ...(password ? { password } : {}),
        ...(role === "STUDENT" && studentEmail ? { studentEmail } : {})
      };

      const res = await api.post("/api/admin/users", payload);

      setMsg(`✅ Utilisateur créé: ${res.data.email} (${res.data.role}). Email envoyé.`);
      setEmail("");
      setPassword("");
      setStudentEmail("");
      setRole("STUDENT");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Erreur création utilisateur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", mt: 2 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            Créer un utilisateur
          </Typography>

          <form onSubmit={submit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              select
              label="Rôle"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="SCOLARITE">SCOLARITE</MenuItem>
              <MenuItem value="STUDENT">STUDENT</MenuItem>
            </TextField>

            {role === "STUDENT" && (
              <TextField
                fullWidth
                label="Email étudiant (optionnel, pour lier Student)"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="Mot de passe (optionnel - sinon généré)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {err && <Typography color="error" sx={{ mb: 2 }}>{err}</Typography>}
            {msg && <Typography color="success.main" sx={{ mb: 2 }}>{msg}</Typography>}

            <Button fullWidth variant="contained" type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer + Envoyer email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
