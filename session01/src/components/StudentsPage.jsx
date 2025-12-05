import React, { useState } from "react";
import PageWrapper from "./PageWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TextField,
  Box,
} from "@mui/material";

function StudentsPage({ students }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstname} ${s.lastname}`.toLowerCase();
    const txt = search.toLowerCase();
    return fullName.includes(txt) || String(s.id).includes(txt);
  });

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <PageWrapper>
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h5" component="h2">
            Étudiants
          </Typography>
        </Box>

        <TextField
          label="Rechercher (nom, prénom, id...)"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 260 }}
        />
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, rgba(37,99,235,0.08), rgba(147,51,234,0.08))",
                }}
              >
                <TableCell>ID Étudiant</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.firstname}</TableCell>
                  <TableCell>{s.lastname}</TableCell>
                </TableRow>
              ))}

              {paginatedStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Aucun étudiant trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Lignes par page"
        />
      </Paper>
    </Box>
    </PageWrapper>
  );
}

export default StudentsPage;
