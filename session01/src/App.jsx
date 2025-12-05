import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Menu from "./components/Menu";
import Header from "./components/Header";
import Home from "./components/Home";
import NotesPage from "./components/NotesPage";
import NoteDetailsPage from "./components/NoteDetailsPage";
import StudentsPage from "./components/StudentsPage";
import CoursesPage from "./components/CoursesPage";
import AboutPage from "./components/AboutPage";
import DashboardPage from "./components/DashboardPage";

const API_BASE_URL = "http://localhost:8010/api";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      © {year} - Carlory.Eliantus, Tous droits réservés.
    </footer>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Charger les données depuis ton backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1) Grades
        const gradesRes = await fetch(`${API_BASE_URL}/grades`);
        if (!gradesRes.ok)
          throw new Error(`Erreur HTTP grades ${gradesRes.status}`);
        const apiGrades = await gradesRes.json();

        const mappedNotes = apiGrades.map((g, index) => ({
          unique_id: g._id || index,
          course: g.course?.name || g.course?.code || "N/A",
          student: {
            firstname: g.student?.firstName || "",
            lastname: g.student?.lastName || "",
            id: g.student?._id || "",
          },
          date: g.date ? g.date.substring(0, 10) : "",
          grade: g.grade,
        }));
        setNotes(mappedNotes);

        // 2) Students
        const studentsRes = await fetch(`${API_BASE_URL}/students`);
        if (studentsRes.ok) {
          const apiStudents = await studentsRes.json();
          const mappedStudents = apiStudents.map((s) => ({
            id: s._id,
            firstname: s.firstName,
            lastname: s.lastName,
          }));
          setStudents(mappedStudents);
        }

        // 3) Courses
        const coursesRes = await fetch(`${API_BASE_URL}/courses`);
        if (coursesRes.ok) {
          const apiCourses = await coursesRes.json();
          const mappedCourses = apiCourses.map((c) => ({
            id: c._id,
            name: c.name,
            code: c.code,
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="page">
          <Menu />
          <div className="main-content">
            <Header />
            <main className="content">
              <p>Chargement des données...</p>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="page">
          <Menu />
          <div className="main-content">
            <Header />
            <main className="content">
              <p style={{ color: "red" }}>Erreur : {error}</p>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page">
        {/* Menu latéral */}
        <Menu />

        <div className="main-content">
          <Header />

          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/dashboard" element={<DashboardPage notes={notes} />} />

              <Route path="/notes" element={<NotesPage notes={notes} />} />
              <Route
                path="/notes/:id"
                element={<NoteDetailsPage notes={notes} />}
              />

              <Route
                path="/students"
                element={<StudentsPage students={students} />}
              />

              <Route
                path="/courses"
                element={<CoursesPage courses={courses} />}
              />

              <Route path="/about" element={<AboutPage />} />

              {/* Route de secours */}
              <Route path="*" element={<p>Page introuvable.</p>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
