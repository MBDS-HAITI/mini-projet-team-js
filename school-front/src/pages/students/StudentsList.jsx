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
  DialogActions
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({ open: false, student: null });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/students");
      setItems(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur chargement étudiants");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((s) =>
      [s.matricule, s.prenom, s.nom, s.email, s.niveau, s.filiere]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    );
  }, [items, q]);



  const openDeleteDialog = (student) => {
    setDeleteDialog({ open: true, student });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, student: null });
  };

  const confirmDelete = async () => {
    const { student } = deleteDialog;
    if (!student) return;

    setError("");
    try {
      await api.delete(`/api/students/${student._id}`);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Suppression impossible");
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0B1220 0%, #111A2E 100%)'
        : 'linear-gradient(135deg, #F6F7FB 0%, #FFFFFF 100%)',
      p: { xs: 2, md: 3 }
    }}>
      {/* Header Section */}
      <Fade in={true} timeout={600}>
        <Card sx={{
          mb: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1A2332 0%, #111A2E 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite'
          },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md="auto">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)'
                  }}>
                    <SchoolIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5
                      }}
                    >
                      Gestion des Étudiants
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filtered.length} étudiant{filtered.length !== 1 ? 's' : ''} • {items.filter(s => s.actif).length} actif{items.filter(s => s.actif).length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md="auto">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    component={RouterLink}
                    to="/print/students"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    Imprimer / PDF
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/students/create"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #00BCD4)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                      }
                    }}
                  >
                    Nouveau Étudiant
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Search Section */}
      <Fade in={true} timeout={800}>
        <Card sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.2)'
            : '0 4px 20px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par matricule, nom, email, niveau ou filière..."
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </Fade>

      {/* Messages */}
      <Fade in={!!info} timeout={500}>
        <Box>
          {info && (
            <Card sx={{
              mb: 3,
              border: "2px solid",
              borderColor: "success.main",
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(76, 175, 80, 0.1)'
                : 'rgba(76, 175, 80, 0.05)'
            }}>
              <CardContent sx={{ py: 2 }}>
                <Typography color="success.main" sx={{ fontWeight: 500 }}>
                  ✅ {info}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>

      <Fade in={!!error} timeout={500}>
        <Box>
          {error && (
            <Card sx={{
              mb: 3,
              border: "2px solid",
              borderColor: "error.main",
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(244, 67, 54, 0.1)'
                : 'rgba(244, 67, 54, 0.05)'
            }}>
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
      <Fade in={true} timeout={1000}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1A2332 0%, #111A2E 100%)'
                  : 'linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)',
                '& .MuiTableCell-head': {
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.divider}`
                }
              }}>
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
                // Skeleton Loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box>
                          <Skeleton variant="text" width={120} height={24} />
                          <Skeleton variant="text" width={80} height={18} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={150} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary">
                        Aucun étudiant trouvé
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        {q ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter un étudiant'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s, index) => (
                  <TableRow
                    key={s._id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0
                        ? 'transparent'
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.02)'
                          : 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(33, 150, 243, 0.08)'
                          : 'rgba(33, 150, 243, 0.04)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          bgcolor: s.actif ? 'primary.main' : 'grey.500',
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                          fontWeight: 600
                        }}>
                          {s.prenom?.[0]}{s.nom?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {s.prenom} {s.nom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {s.matricule}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {s.email}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={s.niveau || "N/A"}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          minWidth: 60
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {s.filiere || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={s.actif ? "Actif" : "Inactif"}
                        size="small"
                        color={s.actif ? "success" : "default"}
                        variant={s.actif ? "filled" : "outlined"}
                        sx={{
                          borderRadius: 1,
                          fontWeight: 600,
                          minWidth: 70
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          component={RouterLink}
                          to={`/students/${s._id}`}
                          sx={{
                            borderRadius: 2,
                            minWidth: 'auto',
                            px: 2,
                            '&:hover': {
                              bgcolor: 'info.main',
                              color: 'white',
                              borderColor: 'info.main'
                            }
                          }}
                        >
                          {!isMobile && 'Détails'}
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          component={RouterLink}
                          to={`/students/${s._id}/edit`}
                          sx={{
                            borderRadius: 2,
                            minWidth: 'auto',
                            px: 2,
                            '&:hover': {
                              bgcolor: 'warning.main',
                              color: 'white',
                              borderColor: 'warning.main'
                            }
                          }}
                        >
                          {!isMobile && 'Modifier'}
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => openDeleteDialog(s)}
                          sx={{
                            borderRadius: 2,
                            minWidth: 'auto',
                            px: 2,
                            '&:hover': {
                              bgcolor: 'error.main',
                              color: 'white',
                              borderColor: 'error.main'
                            }
                          }}
                        >
                          {!isMobile && 'Supprimer'}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 50px rgba(0,0,0,0.5)'
              : '0 25px 50px rgba(0,0,0,0.25)'
          }
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <DeleteIcon />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer l'étudiant{' '}
            <strong>
              {deleteDialog.student?.prenom} {deleteDialog.student?.nom}
            </strong>
            {' '}?
            <br />
            <br />
            Cette action est <strong>irréversible</strong> et supprimera définitivement toutes les données de cet étudiant.
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
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark'
              }
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
