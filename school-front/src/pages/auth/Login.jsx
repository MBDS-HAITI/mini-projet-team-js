import React, { useContext, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7010";

  const sso = (provider) => {
    window.location.href = `${API_URL}/api/oauth/${provider}`;
  };

  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur connexion");
    }
  };

  return (
    <Container maxWidth="sm">
     <Box
  sx={{
    mt: 10,
    p: 4,
    borderRadius: 3,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider"
  }}
>

        <Typography variant="h5" sx={{ mb: 2 }}>Connexion</Typography>
        <form onSubmit={submit}>
          <TextField fullWidth label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Mot de passe" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} sx={{ mb: 2 }} />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button fullWidth variant="contained" type="submit">Se connecter</Button>

          <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => sso("google")}>
  Continuer avec Google
</Button>
<Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => sso("github")}>
  Continuer avec GitHub
</Button>
<Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => sso("linkedin")}>
  Continuer avec LinkedIn
</Button>

        </form>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Comptes seed backend :
          </Typography>
          <Typography variant="body2">ADMIN: admin@mail.com / 1234</Typography>
          <Typography variant="body2">SCOLARITE: scolarite@mail.com / Scolarite@123</Typography>
          <Typography variant="body2">STUDENT: student@mail.com / Student@123</Typography>
        </Box>
      </Box>
    </Container>
  );
}
