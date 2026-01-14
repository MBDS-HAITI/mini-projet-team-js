import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonAddAlt1Icon />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Nouvel utilisateur
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Créez un compte et envoyez automatiquement les identifiants.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              component={RouterLink}
              to="/users"
              sx={{ textTransform: "none" }}
            >
              Retour à la liste
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={submit} noValidate>
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {err && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {err}
              </Alert>
            )}
            {msg && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {msg}
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/users"
              >
                Annuler
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer + envoyer l'email"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
