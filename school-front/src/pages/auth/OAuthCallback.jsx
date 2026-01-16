import React, { useEffect, useContext, useState } from "react";
import { Box, CircularProgress, Container, Typography, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { api } from "../../api/http";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { setSession } = useContext(AuthContext);

  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = params.get("token");
      const studentLinked = params.get("studentLinked");
      const oauth = params.get("oauth");

      if (!token) {
        if (oauth === "fail") setError("OAuth échoué. Réessayez.");
        else if (oauth === "blocked") setError("Votre compte est bloqué ou suspendu. Veuillez contacter l'administrateur ou le responsable de l'école.");
        else setError("Token absent.");
        return;
      }

      try {
        // 1) stocker token pour l'interceptor axios
        localStorage.setItem("token", token);

        // 2) récupérer le user via /api/auth/me
        const res = await api.get("/api/auth/me");
        const me = res.data.user;

        if (!me || !me.role) {
          throw new Error("Profil utilisateur introuvable.");
        }

        // 3) enregistrer session (token + user)
        setSession({ token, user: me });

        // 4) redirect selon rôle (utilise replace et nettoie l'URL du callback)
        let target;
        if (me.role === "ADMIN") target = "/admin";
        else if (me.role === "SCOLARITE") target = "/scolarite";
        else {
          target = studentLinked === "0" ? "/student/link?missingStudent=1" : "/student";
        }
        nav(target, { replace: true });
        try { window.history.replaceState(null, "", target); } catch { /* ignore */ }

      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "OAuth échoué");
        localStorage.removeItem("token");
      }
    })();
  }, [params, nav, setSession]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {!error ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connexion en cours...
            </Typography>
            <CircularProgress />
          </>
        ) : (
          <>
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => nav("/login", { replace: true })}>
              Retour au login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
