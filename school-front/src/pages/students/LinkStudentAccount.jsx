import React, { useContext, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { api } from "../../api/http";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";

export default function LinkStudentAccount() {
  const { setSession, user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [params] = useSearchParams();
  const missingStudent = params.get("missingStudent");
  const [studentEmail, setStudentEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  if (user?.studentId) return <Navigate to="/student" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // ✅ backend recommandé: retourne { token, user, mailSent }
      const res = await api.post("/api/students/link-me", { studentEmail });
      const { token, user: me, mailSent } = res.data;

      setSession({ token, user: me });

      // afficher un message d'info selon l'envoi du mail puis rediriger
      console.log("mailSent:", mailSent, "mailError:", res.data.mailError);
      if (mailSent) {
        setInfo("Compte lié. Un e-mail de confirmation a été envoyé.");
      } else {
        const shortErr = res.data.mailError ? ` (${res.data.mailError})` : "";
        setInfo(`Compte lié, mais l'e-mail de confirmation n'a pas pu être envoyé.${shortErr}`);
      }

      setTimeout(() => nav("/student", { replace: true }), 1200);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Impossible de lier ce compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 900 }}>
          Lier mon compte étudiant
        </Typography>

        <Typography sx={{ opacity: 0.8, mb: 2 }}>
          Entrez l’email officiel qui existe dans la liste des étudiants (Students).
        </Typography>

        {missingStudent === "1" && (
          <Typography color="warning.main" sx={{ mb: 2 }}>
            Aucun dossier étudiant associé trouvé : veuillez contacter la scolarité/administration pour créer votre fiche, puis revenir lier votre compte.
          </Typography>
        )}

        <form onSubmit={submit}>
          <TextField fullWidth label="Email étudiant" value={studentEmail} onChange={(e)=>setStudentEmail(e.target.value)} sx={{ mb: 2 }} />

          {err && <Typography color="error" sx={{ mb: 2 }}>{err}</Typography>}

          {info && <Typography color="success.main" sx={{ mb: 2 }}>{info}</Typography>}

          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? "Liaison..." : "Lier mon compte"}
          </Button>

          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => { logout(); nav("/login", { replace: true }); }}>
            Retour au login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
