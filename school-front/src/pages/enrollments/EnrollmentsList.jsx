import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Avatar,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../api/http";

const statutChip = (statut) => {
  if (statut === "VALIDE") return { label: "Validé", variant: "outlined" };
  if (statut === "EN_ATTENTE") return { label: "En attente", variant: "outlined" };
  if (statut === "ANNULE") return { label: "Annulé", variant: "outlined" };
  return { label: statut || "-", variant: "outlined" };
};

export default function EnrollmentsList() {
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [en] = await Promise.all([
        api.get("/api/enrollments"),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setItems(en.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement inscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((e) => {
      const s = e.student || {};
      const c = e.course || {};
      const values = [
        s.matricule, s.prenom, s.nom,
        c.code, c.titre,
        e.anneeAcademique,
        e.statut,
        String(e.dateInscription || "")
      ].filter(Boolean);
      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const openCreate = () => {
    navigate("/enrollments/create");
  };

  const openEdit = (en) => {
    navigate(`/enrollments/${en._id}/edit`);
  };

  const askRemove = (enrollment) => {
    setEnrollmentToDelete(enrollment);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setEnrollmentToDelete(null);
  };

  const confirmRemove = async () => {
    if (!enrollmentToDelete?._id) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/enrollments/${enrollmentToDelete._id}`);
      await loadAll();
      setConfirmOpen(false);
      setEnrollmentToDelete(null);
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          color: "white",
          boxShadow: 3
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Gestion des Inscriptions
              </Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                component={RouterLink}
                to="/print/enrollments"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": { borderColor: "white" }
                }}
              >
                Aperçu liste
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
                }}
              >
                Nouvelle inscription
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
            label="Recherche (étudiant, cours, année, statut...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </CardContent>
      </Card>

      {error && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent><Typography color="error">{error}</Typography></CardContent>
        </Card>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
          "& .MuiTable-root": {
            borderCollapse: "separate",
            borderSpacing: "0 8px"
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background:
                  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                "& .MuiTableCell-head": {
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "text.primary",
                  borderBottom: "none",
                  py: 2
                }
              }}
            >
              <TableCell>Étudiant</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Année</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  sx={{ "& .MuiTableCell-root": { borderBottom: "none", py: 2 } }}
                >
                  <TableCell>
                    <Skeleton variant="text" width={220} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={220} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={24}
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                      />
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                      />
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <SchoolIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune inscription trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essayez de modifier votre recherche ou ajoutez une nouvelle inscription.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((en, index) => {
                const s = en.student || {};
                const c = en.course || {};
                const chip = statutChip(en.statut);

                return (
                  <TableRow
                    key={en._id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "background.paper" : "grey.50",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "scale(1.01)",
                        transition: "all 0.2s ease-in-out"
                      },
                      "& .MuiTableCell-root": {
                        borderBottom: "none",
                        py: 2.5
                      }
                    }}
                  >
                    <TableCell>
                      {s.matricule
                        ? `${s.matricule} • ${s.prenom} ${s.nom}`
                        : en.studentId || "-"}
                    </TableCell>
                    <TableCell>
                      {c.code
                        ? `${c.code} • ${c.titre}`
                        : en.courseId || "-"}
                    </TableCell>
                    <TableCell>{en.anneeAcademique || "-"}</TableCell>
                    <TableCell>
                      {en.dateInscription
                        ? String(en.dateInscription).slice(0, 10)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant={chip.variant} label={chip.label} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/enrollments/${en._id}`)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "white",
                              transform: "scale(1.1)"
                            },
                            transition: "all 0.2s"
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => openEdit(en)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "secondary.light",
                              color: "white",
                              transform: "scale(1.1)"
                            },
                            transition: "all 0.2s"
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => askRemove(en)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "error.light",
                              color: "white",
                              transform: "scale(1.1)"
                            },
                            transition: "all 0.2s"
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

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Supprimer cette inscription ?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Êtes-vous sûr de vouloir supprimer cette inscription ?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cette action est irréversible et supprimera définitivement cette inscription.
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
