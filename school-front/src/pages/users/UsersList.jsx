import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Skeleton,
  Avatar,
  InputAdornment,
  Fade,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../api/http";

const roleChip = (role) => ({ label: role || "-", variant: "outlined" });

export default function UsersList() {
  const theme = useTheme();

  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [u, s] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/students")
      ]);
      // normalize: backend returns studentId populated
      setItems(u.data.map(x => ({ ...x, student: x.studentId || null })));
      setStudents(s.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((u) => {
      const st = u.student || {};
      const values = [
        u.email, u.role,
        st.matricule, st.prenom, st.nom
      ].filter(Boolean);
      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const openDeleteDialog = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const confirmDelete = async () => {
    const { user } = deleteDialog;
    if (!user) return;

    setError("");
    try {
      await api.delete(`/api/users/${user._id}`);
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0B1220 0%, #111A2E 100%)"
            : "linear-gradient(135deg, #F6F7FB 0%, #FFFFFF 100%)",
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Fade in timeout={600}>
        <Card
          sx={{
            mb: 3,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1A2332 0%, #111A2E 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            border: `1px solid ${theme.palette.divider}`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #3F51B5, #00BCD4, #3F51B5)",
              backgroundSize: "200% 100%",
              animation: "gradientShift 3s ease infinite",
            },
            "@keyframes gradientShift": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} md="auto">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 56,
                      height: 56,
                      boxShadow: "0 4px 14px rgba(63, 81, 181, 0.3)",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background:
                          "linear-gradient(45deg, #3F51B5, #00BCD4)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 0.5,
                      }}
                    >
                      Gestion des Utilisateurs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filtered.length} utilisateur
                      {filtered.length !== 1 ? "s" : ""} •
                      {" "}
                      {items.filter((u) => !u.blocked).length} actif
                      {items.filter((u) => !u.blocked).length !== 1
                        ? "s"
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md="auto">
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    component={RouterLink}
                    to="/print/users"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Imprimer / PDF
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/register"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      background:
                        "linear-gradient(45deg, #3F51B5, #00BCD4)",
                      boxShadow: "0 4px 14px rgba(63, 81, 181, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #303F9F, #0097A7)",
                        boxShadow: "0 6px 20px rgba(63, 81, 181, 0.4)",
                      },
                    }}
                  >
                    Nouvel utilisateur
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Search */}
      <Fade in timeout={800}>
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.2)"
                : "0 4px 20px rgba(0,0,0,0.08)",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par email, rôle ou étudiant lié..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </Fade>

      {/* Error */}
      <Fade in={!!error} timeout={500}>
        <Box>
          {error && (
            <Card
              sx={{
                mb: 3,
                border: "2px solid",
                borderColor: "error.main",
                borderRadius: 2,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(244, 67, 54, 0.1)"
                    : "rgba(244, 67, 54, 0.05)",
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Typography color="error.main" sx={{ fontWeight: 500 }}>
                  ⚠️ {error}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>

      {/* Table */}
      <Fade in timeout={1000}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #1A2332 0%, #111A2E 100%)"
                      : "linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)",
                  "& .MuiTableCell-head": {
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                  },
                }}
              >
                <TableCell>Utilisateur</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Étudiant lié</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box>
                          <Skeleton
                            variant="text"
                            width={160}
                            height={24}
                          />
                          <Skeleton
                            variant="text"
                            width={100}
                            height={18}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={24}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="text"
                        width={160}
                        height={20}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={70}
                        height={24}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Skeleton
                          variant="rectangular"
                          width={70}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={70}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={90}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 8, textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <PersonIcon
                        sx={{
                          fontSize: 64,
                          color: "text.disabled",
                          opacity: 0.5,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        Aucun utilisateur trouvé
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        {q
                          ? "Essayez de modifier vos critères de recherche"
                          : "Commencez par créer un utilisateur"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u, index) => {
                  const chip = roleChip(u.role);
                  const st = u.student || null;
                  const stLabel = st
                    ? `${st.matricule} • ${st.prenom} ${st.nom}`
                    : "-";
                  const initials = u.email
                    ? u.email.charAt(0).toUpperCase()
                    : "?";

                  return (
                    <TableRow
                      key={u._id}
                      hover
                      sx={{
                        backgroundColor:
                          index % 2 === 0
                            ? "transparent"
                            : theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.02)",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(63, 81, 181, 0.16)"
                              : "rgba(63, 81, 181, 0.06)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transition: "all 0.2s ease-in-out",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: u.blocked
                                ? "grey.500"
                                : "primary.main",
                              width: 40,
                              height: 40,
                              fontSize: "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {u.email}
                            </Typography>
                            {st && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {st.prenom} {st.nom}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          variant={chip.variant}
                          label={chip.label}
                          sx={{ borderRadius: 1, fontWeight: 500 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{stLabel}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={u.blocked ? "Bloqué" : "Actif"}
                          size="small"
                          color={u.blocked ? "error" : "success"}
                          variant={u.blocked ? "filled" : "outlined"}
                          sx={{
                            borderRadius: 1,
                            fontWeight: 600,
                            minWidth: 70,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            component={RouterLink}
                            to={`/users/${u._id}`}
                            aria-label="Détails utilisateur"
                            sx={{
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="secondary"
                            component={RouterLink}
                            to={`/users/${u._id}/edit`}
                            aria-label="Modifier utilisateur"
                            sx={{
                              "&:hover": {
                                backgroundColor: "secondary.light",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color={u.blocked ? "success" : "error"}
                            aria-label={u.blocked ? "Débloquer utilisateur" : "Bloquer utilisateur"}
                            onClick={async () => {
                              try {
                                if (u.blocked)
                                  await api.post(`/api/users/${u._id}/unblock`);
                                else
                                  await api.post(`/api/users/${u._id}/block`);
                                await loadAll();
                              } catch (e) {
                                setError(
                                  e?.response?.data?.message ||
                                    "Action impossible"
                                );
                              }
                            }}
                            sx={{
                              "&:hover": {
                                backgroundColor: u.blocked
                                  ? "success.light"
                                  : "error.light",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            {u.blocked ? (
                              <LockOpenIcon fontSize="small" />
                            ) : (
                              <BlockIcon fontSize="small" />
                            )}
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Supprimer utilisateur"
                            onClick={() => openDeleteDialog(u)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "error.light",
                                color: "white",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Delete dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-user-dialog-title"
        aria-describedby="delete-user-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 25px 50px rgba(0,0,0,0.5)"
                : "0 25px 50px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle
          id="delete-user-dialog-title"
          sx={{
            bgcolor: "error.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DeleteIcon />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="delete-user-dialog-description">
            Êtes-vous sûr de vouloir supprimer l'utilisateur
            {" "}
            <strong>{deleteDialog.user?.email}</strong> ?
            <br />
            <br />
            Cette action est <strong>irréversible</strong> et supprimera
            définitivement ce compte utilisateur.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              bgcolor: "error.main",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
