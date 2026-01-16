import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Divider, Grid,
  IconButton, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Chip, Skeleton, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import GradeIcon from "@mui/icons-material/Grade";

import { Link as RouterLink } from "react-router-dom";
import { api } from "../../api/http";

export default function CoursesList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/courses");
      setItems(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((c) =>
      [c.code, c.titre, c.niveau, c.filiere]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    );
  }, [items, q]);

  // L'édition se fait maintenant sur une page dédiée

  const askRemove = (course) => {
    setCourseToDelete(course);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setCourseToDelete(null);
  };

  const confirmRemove = async () => {
    if (!courseToDelete?._id) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/courses/${courseToDelete._id}`);
      await load();
      setConfirmOpen(false);
      setCourseToDelete(null);
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        color: 'white',
        boxShadow: 3
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Gestion des Cours</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                component={RouterLink}
                to="/print/courses"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
              >
                Aperçu liste
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={RouterLink}
                to="/courses/create"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                Ajouter un Cours
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Rechercher des cours..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card sx={{ mb: 3, border: "1px solid", borderColor: "error.main", borderRadius: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        '& .MuiTable-root': { borderCollapse: 'separate', borderSpacing: '0 8px' }
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              '& .MuiTableCell-head': {
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                borderBottom: 'none',
                py: 2
              }
            }}>
              <TableCell>Code</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Crédit</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Filière</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} sx={{ '& .MuiTableCell-root': { borderBottom: 'none', py: 2 } }}>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={150} /></TableCell>
                  <TableCell sx={{ textAlign: 'center' }}><Skeleton variant="text" width={40} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell><Skeleton variant="text" width={200} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun cours trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essayez de modifier votre recherche ou ajoutez un nouveau cours.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c, index) => (
                <TableRow
                  key={c._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'background.paper' : 'grey.50',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease-in-out'
                    },
                    '& .MuiTableCell-root': {
                      borderBottom: 'none',
                      py: 2.5
                    },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {c.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {c.titre}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                      <CreditScoreIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {c.credit ?? 0}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.niveau || "N/A"}
                      size="small"
                      variant="filled"
                      sx={{ backgroundColor: 'info.light', color: 'info.contrastText' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {c.filiere || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={c.actif ? "Actif" : "Inactif"}
                      color={c.actif ? "success" : "default"}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {c.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        component={RouterLink}
                        to={`/courses/${c._id}`}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        component={RouterLink}
                        to={`/courses/${c._id}/edit`}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'secondary.light',
                            color: 'white',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => askRemove(c)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Supprimer ce cours ?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Êtes-vous sûr de vouloir supprimer le cours
            {" "}
            <strong>{courseToDelete?.titre || courseToDelete?.code}</strong>
            {" "}?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cette action est irréversible et supprimera définitivement ce cours.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={deleting}>
            Annuler
          </Button>
          <Button
            onClick={confirmRemove}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
