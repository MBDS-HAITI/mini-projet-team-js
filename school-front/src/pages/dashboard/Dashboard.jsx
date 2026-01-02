import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../api/http";
import { AuthContext } from "../../auth/AuthContext";

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
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/dashboard");
      setData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Erreur dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const title = useMemo(() => {
    if (!user) return "Dashboard";
    if (user.role === "ADMIN") return "Dashboard Administrateur";
    if (user.role === "SCOLARITE") return "Dashboard Scolarité";
    return "Mon Dashboard Étudiant";
  }, [user]);

  const k = data?.kpis || {};
  const charts = data?.charts || {};
  const enrollmentsByStatut = charts.enrollmentsByStatut || [];
  const gradesByRange = charts.gradesByRange || [];

  // couleurs auto (pas besoin de fixer, mais recharts a besoin de Cell)
  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 900 }} color="text.primary">
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

      {/* KPI */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Étudiants" value={k.students ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Cours" value={k.courses ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Inscriptions" value={k.enrollments ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Notes" value={k.grades ?? 0} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 2, height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }} color="text.primary">
                Inscriptions par statut
              </Typography>

              <Box sx={{ height: 340, width: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentsByStatut}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 2, height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }} color="text.primary">
                Répartition des notes
              </Typography>

              <Box sx={{ height: 340, width: 400 }}>
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
