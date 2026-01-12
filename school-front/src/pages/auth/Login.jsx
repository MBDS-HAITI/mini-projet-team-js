import React, { useContext, useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { Google, GitHub, LinkedIn, Facebook, LockOutlined } from '@mui/icons-material';
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const nav = useNavigate();

  if (user) return <Navigate to="/" replace />;  // prevent logged-in users from seeing login

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7010";

  const sso = (provider) => {
    window.location.href = `${API_URL}/api/oauth/${provider}`;
  };

  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await login(email, password);
  //     nav("/");
  //   } catch (err) {
  //     setError(err?.response?.data?.message || err?.message || "Erreur connexion");
  //   }
  // };

  const submit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const u = await login(email, password); // ✅ récupère le user
    // redirection vers /, ton App.jsx redirige selon role
    nav("/", { replace: true });
  } catch (err) {
    setError(err?.response?.data?.message || err?.message || "Erreur connexion");
  }
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mt: 2,
                fontWeight: 700,
                color: 'text.primary',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Système Scolaire
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mt: 1,
              }}
            >
              Connectez-vous à votre espace
            </Typography>
          </Box>

          <Box component="form" onSubmit={submit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />

            {error && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'error.light',
                  border: '1px solid',
                  borderColor: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LockOutlined sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="body2" color="error.main">
                  {error}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Se connecter
            </Button>

            <Box sx={{ position: 'relative', my: 3 }}>
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  position: 'relative',
                  display: 'inline-block',
                  mx: 'auto',
                }}
              >
                ou continuer avec
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => sso("google")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#db4437',
                    bgcolor: 'rgba(219, 68, 55, 0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(219, 68, 55, 0.2)',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => sso("github")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#333',
                    bgcolor: 'rgba(51, 51, 51, 0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(51, 51, 51, 0.2)',
                  },
                }}
              >
                GitHub
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LinkedIn />}
                onClick={() => sso("linkedin")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#0077b5',
                    bgcolor: 'rgba(0, 119, 181, 0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)',
                  },
                }}
              >
                LinkedIn
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => sso("facebook")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1877f2',
                    bgcolor: 'rgba(24, 119, 242, 0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(24, 119, 242, 0.2)',
                  },
                }}
              >
                Facebook
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
