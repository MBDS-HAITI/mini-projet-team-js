import React, { useEffect, useContext, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { api } from "../../api/http";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { setSession } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const token = params.get("token");
      if (!token) {
        setError("Token absent.");
        return;
      }

      try {
        localStorage.setItem("token", token);

        // récupère user payload
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSession({ token, user: res.data.user });
        nav("/", { replace: true });
      } catch (e) {
        setError(e?.response?.data?.message || "OAuth échoué");
        localStorage.removeItem("token");
      }
    };

    run();
  }, [params, nav, setSession]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {!error ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>Connexion en cours...</Typography>
            <CircularProgress />
          </>
        ) : (
          <Typography color="error">{error}</Typography>
        )}
      </Box>
    </Container>
  );
}
