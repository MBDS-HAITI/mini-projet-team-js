import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
  IconButton,
  Avatar,
  Skeleton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import GradeIcon from "@mui/icons-material/Grade";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../api/http";

export default function GradesList() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [g, s, c] = await Promise.all([
        api.get("/api/grades"),
        api.get("/api/students"),
        api.get("/api/courses")
      ]);
      setItems(g.data);
      setStudents(s.data);
      setCourses(c.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((g) => {
      const s = g.student || {};
      const c = g.course || {};
      const values = [
        s.matricule, s.prenom, s.nom,
        c.code, c.titre,
        g.periode,
        String(g.note ?? ""),
        String(g.sur ?? "")
      ].filter(Boolean);

      return values.some((v) => String(v).toLowerCase().includes(query));
    });
  }, [items, q]);

  const askRemove = (grade) => {
    setGradeToDelete(grade);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setGradeToDelete(null);
  };

  const confirmRemove = async () => {
    if (!gradeToDelete?._id) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/grades/${gradeToDelete._id}`);
      await loadAll();
      setConfirmOpen(false);
      setGradeToDelete(null);
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    } finally {
      setDeleting(false);
    }
  };

  const pct = (note, sur) => {
    const n = Number(note) || 0;
    const s = Number(sur) || 0;
    if (s <= 0) return 0;
    return Math.round((n / s) * 100);
  };

  const pctChip = (p) => {
    if (p >= 80) return { label: `${p}%`, variant: "outlined", color: "success" };
    if (p >= 60) return { label: `${p}%`, variant: "outlined", color: "warning" };
    return { label: `${p}%`, variant: "outlined", color: "error" };
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
          boxShadow: 3,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <GradeIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Gestion des Notes
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Suivi des notes par étudiant, cours et période.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                component={RouterLink}
                to="/print/grades"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": { borderColor: "white" },
                }}
              >
                Aperçu liste
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={RouterLink}
                to="/grades/create"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                Ajouter une Note
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
            label="Rechercher des notes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </CardContent>
      </Card>

      {/* Error */}
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
            borderSpacing: "0 8px",
          },
        }}
      >
        <Table size="small">
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
                  py: 2,
                },
              }}
            >
              <TableCell>Étudiant</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Période</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>%</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "& .MuiTableCell-root": { borderBottom: "none", py: 2 },
                  }}
                >
                  <TableCell>
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={24}
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                      />
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                      />
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <GradeIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune note trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Essayez de modifier votre recherche ou ajoutez une nouvelle note.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((g, index) => {
                const s = g.student || {};
                const c = g.course || {};
                const p = pct(g.note, g.sur);
                const chip = pctChip(p);

                return (
                  <TableRow
                    key={g._id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "background.paper" : "grey.50",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "scale(1.01)",
                        transition: "all 0.2s ease-in-out",
                      },
                      "& .MuiTableCell-root": {
                        borderBottom: "none",
                        py: 2.5,
                      },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell>
                      {s.matricule ? (
                        <span>{s.matricule} • {s.prenom} {s.nom}</span>
                      ) : (
                        <span>{g.studentId || "-"}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {c.code ? (
                        <span>{c.code} • {c.titre}</span>
                      ) : (
                        <span>{g.courseId || "-"}</span>
                      )}
                    </TableCell>

                    <TableCell>{g.periode || "-"}</TableCell>

                    <TableCell>
                      {g.note ?? 0} / {g.sur ?? 100}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        variant={chip.variant}
                        color={chip.color}
                        label={chip.label}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/grades/${g._id}`)}
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
                          onClick={() => navigate(`/grades/${g._id}/edit`)}
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
                          onClick={() => askRemove(g)}
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
        <DialogTitle sx={{ fontWeight: 800 }}>
          Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Voulez-vous vraiment supprimer cette note ? Cette action est
            définitive.
          </Typography>
          {gradeToDelete && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                <b>Étudiant :</b>{" "}
                {gradeToDelete.student?.matricule
                  ? `${gradeToDelete.student.matricule} • ${gradeToDelete.student.prenom} ${gradeToDelete.student.nom}`
                  : gradeToDelete.studentId || "-"}
              </Typography>
              <Typography variant="body2">
                <b>Cours :</b>{" "}
                {gradeToDelete.course?.code
                  ? `${gradeToDelete.course.code} • ${gradeToDelete.course.titre}`
                  : gradeToDelete.courseId || "-"}
              </Typography>
              <Typography variant="body2">
                <b>Note :</b> {gradeToDelete.note} / {gradeToDelete.sur}
              </Typography>
              <Typography variant="body2">
                <b>Période :</b> {gradeToDelete.periode || "-"}
              </Typography>
            </Box>
          )}
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
