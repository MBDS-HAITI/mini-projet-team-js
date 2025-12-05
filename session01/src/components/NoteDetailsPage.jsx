import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Stack, Button, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageWrapper from "./PageWrapper";

function NoteDetailsPage({ notes }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1️⃣ Si on vient de la liste, la note est dans location.state.note
  const noteFromState = location.state?.note;

  // 2️⃣ Sinon (refresh direct /notes/:id), on la cherche dans props.notes
  const note =
    noteFromState ||
    notes.find((n) => String(n.unique_id) === String(id));

  if (!note) {
    return (
      <PageWrapper>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onClick={() => navigate("/notes")}
          >
            Retour aux notes
          </Button>
          <Typography variant="h6" color="error">
            Note introuvable.
          </Typography>
        </Box>
      </PageWrapper>
    );
  }

  const { course, student, date, grade, unique_id } = note;
  const fullName = `${student?.firstname || ""} ${student?.lastname || ""}`;

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 70) return "warning";
    return "error";
  };

  return (
    <PageWrapper>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onClick={() => navigate("/notes")}
        >
          Retour aux notes
        </Button>

        <Paper
          elevation={3}
          sx={{
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            p: 3,
            maxWidth: 600,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Détail de la note #{unique_id}
          </Typography>

          <Stack spacing={1.5} mt={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Cours
              </Typography>
              <Typography variant="body1">{course}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Étudiant
              </Typography>
              <Typography variant="body1">
                {fullName}{" "}
                {student?.id && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    (ID : {student.id})
                  </Typography>
                )}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Date
              </Typography>
              <Typography variant="body1">{date}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Note
              </Typography>
              <Chip
                label={`${grade} / 100`}
                color={getGradeColor(grade)}
                sx={{ fontWeight: 600, mt: 0.5 }}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}

export default NoteDetailsPage;
