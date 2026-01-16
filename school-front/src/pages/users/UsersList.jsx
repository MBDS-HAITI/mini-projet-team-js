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
import { getStyles } from "./UsersList.styles";

const roleChip = (role) => ({ label: role || "-", variant: "outlined" });

export default function UsersList() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [u] = await Promise.all([
        api.get("/api/users"),
      ]);
      // normalize: backend returns studentId populated
      setItems(u.data.map(x => ({ ...x, student: x.studentId || null })));
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
    <Box sx={styles.mainContainer}>
      {/* Header */}
      <Fade in timeout={600}>
        <Card sx={styles.headerCard}>
          <CardContent sx={styles.headerCardContent}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} md="auto">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={styles.avatar}>
                    <PersonIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={styles.title}>
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
                    sx={styles.printButton}
                  >
                    Imprimer / PDF
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/register"
                    sx={styles.addButton}
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
        <Card sx={styles.searchCard}>
          <CardContent sx={styles.searchCardContent}>
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
              sx={styles.searchTextField}
            />
          </CardContent>
        </Card>
      </Fade>

      {/* Error */}
      <Fade in={!!error} timeout={500}>
        <Box>
          {error && (
            <Card sx={styles.errorCard}>
              <CardContent sx={styles.errorCardContent}>
                <Typography color="error.main" sx={styles.errorText}>
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
          sx={styles.tableContainer}
        >
          <Table>
            <TableHead>
              <TableRow sx={styles.tableHead}>
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
                      <PersonIcon sx={styles.emptyStateIcon} />
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
                      sx={styles.tableRow(index)}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar sx={styles.userAvatar(u.blocked)}>
                            {initials}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={styles.userName}
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
                          sx={styles.roleChip}
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
                          sx={styles.statusChip(u.blocked)}
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
                            sx={styles.actionButton("primary.light")}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="secondary"
                            component={RouterLink}
                            to={`/users/${u._id}/edit`}
                            aria-label="Modifier utilisateur"
                            sx={styles.actionButton("secondary.light")}
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
                            sx={styles.actionButton(u.blocked ? "success.light" : "error.light")}
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
                            sx={styles.actionButton("error.light")}
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
          sx: styles.dialogPaper,
        }}
      >
        <DialogTitle
          id="delete-user-dialog-title"
          sx={styles.dialogTitle}
        >
          <DeleteIcon />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
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
        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={styles.deleteButton}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
