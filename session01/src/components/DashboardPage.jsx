import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function DashboardPage({ notes }) {
  // regrouper par cours
  const statsByCourse = useMemo(() => {
    const map = new Map();

    notes.forEach((n) => {
      const key = n.course || "N/A";
      if (!map.has(key)) {
        map.set(key, { course: key, count: 0, sum: 0 });
      }
      const obj = map.get(key);
      obj.count += 1;
      obj.sum += Number(n.grade || 0);
    });

    return Array.from(map.values()).map((x) => ({
      course: x.course,
      count: x.count,
      avg: x.count > 0 ? Math.round((x.sum / x.count) * 10) / 10 : 0,
    }));
  }, [notes]);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Vue globale sur les matières et les notes.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Carte 1 : nb de notes par matière */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              height: 320,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Nombre de notes par matière
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={statsByCourse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" hide={statsByCourse.length > 6} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Carte 2 : moyenne par matière */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              height: 320,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Moyenne des notes par matière
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={statsByCourse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" hide={statsByCourse.length > 6} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
