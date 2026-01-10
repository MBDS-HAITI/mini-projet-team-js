import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { api } from "../../api/http";
import PrintToolbar from "./PrintToolbar";

function pct(note, sur) {
  if (!sur || sur <= 0) return "-";
  return Math.round((note / sur) * 100);
}

export default function PrintStudentBulletin() {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, gRes] = await Promise.all([api.get('/api/students/me'), api.get('/api/grades/me')]);
      setStudent(sRes.data);
      setGrades(Array.isArray(gRes.data) ? gRes.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const byPeriode = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      const p = g.periode || "-";
      if (!map[p]) map[p] = [];
      map[p].push(g);
    });
    return map;
  }, [grades]);

  const now = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <div className="print-root">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <PrintToolbar title="Bulletin - Aperçu impression" backTo="/student" className="no-print" />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>ÉCOLE SUPÉRIEURE - BULLETIN</Typography>
            <Typography variant="body2" color="text.secondary">Année universitaire: 2025 - 2026</Typography>
          </Box>

          {loading ? (
            <Typography>Chargement...</Typography>
          ) : (!student) ? (
            <Typography>Étudiant introuvable.</Typography>
          ) : (
            <>
              <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontWeight: 700 }}>{student.prenom} {student.nom}</Typography>
                    <Typography>Matricule: {student.matricule}</Typography>
                    <Typography>Filière: {student.filiere || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Email: {student.email}</Typography>
                    <Typography>Niveau: {student.niveau || '-'}</Typography>
                    <Typography>Généré le: {now}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {Object.keys(byPeriode).map((p) => {
                const list = byPeriode[p];
                const sumNote = list.reduce((s, g) => s + (Number(g.note) || 0), 0);
                const sumSur = list.reduce((s, g) => s + (Number(g.sur) || 0), 0);
                const avgPct = sumSur ? Math.round((sumNote / sumSur) * 100) : null;
                const avg20 = sumSur ? ((sumNote / sumSur) * 20).toFixed(2) : null;

                return (
                  <Box key={p} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{p}</Typography>

                    <Table sx={{ mb: 1 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Cours</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Note</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Sur</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>%</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Appréciation</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {list.map((g) => (
                          <TableRow key={g._id}>
                            <TableCell>{g.course?.titre || g.course?.name || (g.courseId?.titre || '-')}</TableCell>
                            <TableCell>{g.note}</TableCell>
                            <TableCell>{g.sur}</TableCell>
                            <TableCell>{pct(g.note, g.sur)}%</TableCell>
                            <TableCell>{g.appreciation || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* summary */}
                    <Box sx={{ mt: 1, textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Moyenne tranche: {sumSur ? `${avgPct}% (${avg20}/20)` : '-'}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Signature (Scolarité)</Typography>
                  <Typography variant="body2" color="text.secondary">__________________________</Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography>Fait le: {now}</Typography>
                  <Typography variant="body2" color="text.secondary">Cachet officiel</Typography>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </div>
  );
}
