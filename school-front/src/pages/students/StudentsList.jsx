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
  Tooltip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";

import { api } from "../../api/http";
import { Link as RouterLink } from "react-router-dom";

export default function StudentsList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, student: null });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/students");
      setItems(res.data ?? []);
    } catch {
      setError("Erreur lors du chargement des étudiants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return items.filter(s =>
      [s.matricule, s.prenom, s.nom, s.email, s.niveau, s.filiere]
        .filter(Boolean)
        .some(v => v.toLowerCase().includes(query))
    );
  }, [items, q]);

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* HEADER */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Gestion des Étudiants
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filtered.length} étudiant(s)
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<PrintIcon />}
                variant="outlined"
                component={RouterLink}
                to="/print/students"
              >
                Imprimer / PDF
              </Button>

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                component={RouterLink}
                to="/students/create"
              >
                Nouveau Étudiant
              </Button>
            </Stack>
          </Grid>
        </CardContent>
      </Card>

      {/* SEARCH */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par matricule, nom, email, niveau ou filière..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Filière</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <PersonIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                  <Typography>Aucun étudiant trouvé</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {s.prenom?.[0]}{s.nom?.[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {s.prenom} {s.nom}
                        </Typography>
                        <Typography variant="caption">{s.matricule}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" />
                      <Typography>{s.email}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip label={s.niveau} size="small" />
                  </TableCell>

                  <TableCell>{s.filiere}</TableCell>

                  <TableCell>
                    <Chip
                      label={s.actif ? "Actif" : "Inactif"}
                      color={s.actif ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>

                  {/* ACTION ICONS */}
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Détails">
                        <IconButton
                          component={RouterLink}
                          to={`/students/${s._id}`}
                          color="info"
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Modifier">
                        <IconButton
                          component={RouterLink}
                          to={`/students/${s._id}/edit`}
                          color="warning"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() =>
                            setDeleteDialog({ open: true, student: s })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DELETE DIALOG */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, student: null })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supprimer définitivement{" "}
            <strong>
              {deleteDialog.student?.prenom} {deleteDialog.student?.nom}
            </strong>{" "}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, student: null })}>
            Annuler
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={async () => {
              await api.delete(`/api/students/${deleteDialog.student._id}`);
              setDeleteDialog({ open: false, student: null });
              load();
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}