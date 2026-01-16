import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../api/http";
import { AuthContext } from "../../auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

function KpiCard({ title, value }) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await api.get("/api/dashboard");
      setData(res.data);
    } catch (e) {
      const msg = e?.response?.data?.message || "Erreur dashboard";

      if (msg === "Student profile not linked") {
        nav("/student/link", { replace: true });
        return;
      }

      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [nav]);

  useEffect(() => { load(); }, [load]);

  const title = useMemo(() => {
    if (!user) return "Dashboard";
    if (user.role === "ADMIN") return "Dashboard Administrateur";
    if (user.role === "SCOLARITE") return "Dashboard Scolarité";
    return "Mon Dashboard Étudiant";
  }, [user]);

  // ✅ si STUDENT sans studentId => page link
  if (user?.role === "STUDENT" && !user?.studentId) {
    return <Navigate to="/student/link" replace />;
  }

  const k = data?.kpis || {};
  const charts = data?.charts || {};
  const enrollmentsByStatut = charts.enrollmentsByStatut || [];
  const gradesByRange = charts.gradesByRange || [];
  const gradesByFiliere = charts.gradesByFiliere || [];

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  const showEnrollChart = user?.role === "ADMIN" || user?.role === "STUDENT";

  return (
    <Box sx={{ p: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} disabled={loading}>
            Rafraîchir
          </Button>
        </Grid>
      </Grid>

      {err && (
        <Card sx={{ mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <CardContent>
            <Typography color="error">{err}</Typography>
          </CardContent>
        </Card>
      )}

      {/* KPI selon rôle */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {user?.role === "ADMIN" && (
          <>
            <Grid item xs={12} sm={6} md={3}><KpiCard title="Étudiants" value={k.students ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={3}><KpiCard title="Cours" value={k.courses ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={3}><KpiCard title="Inscriptions" value={k.enrollments ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={3}><KpiCard title="Notes" value={k.grades ?? 0} /></Grid>
          </>
        )}

        {user?.role === "SCOLARITE" && (
          <>
            <Grid item xs={12} sm={6} md={4}><KpiCard title="Étudiants" value={k.students ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={4}><KpiCard title="Cours" value={k.courses ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={4}><KpiCard title="Notes" value={k.grades ?? 0} /></Grid>
          </>
        )}

        {user?.role === "STUDENT" && (
          <>
            <Grid item xs={12} sm={6} md={6}><KpiCard title="Mes inscriptions" value={k.myEnrollments ?? 0} /></Grid>
            <Grid item xs={12} sm={6} md={6}><KpiCard title="Mes notes" value={k.myGrades ?? 0} /></Grid>
          </>
        )}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 2, height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                {showEnrollChart ? "Inscriptions par statut" : "Notes par filière"}
              </Typography>

              <Box sx={{ height: 340, width: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {showEnrollChart ? (
                    <BarChart data={enrollmentsByStatut}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  ) : (
                    <BarChart data={gradesByFiliere}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 2, height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                Répartition des notes
              </Typography>

              <Box sx={{ height: 340, width: 460 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradesByRange}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={2}
                    >
                      {gradesByRange.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
