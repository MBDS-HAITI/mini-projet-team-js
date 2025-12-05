import React from "react";
import NotesPage from "./NotesPage";
import StudentsPage from "./StudentsPage";
import CoursesPage from "./CoursesPage";
import AboutPage from "./AboutPage";

function Content({ selectedMenu, notes, students, courses, loading, error }) {
  if (loading) {
    return (
      <main className="content">
        <p>Chargement des données...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="content">
        <p style={{ color: "red" }}>Erreur : {error}</p>
      </main>
    );
  }

  return (
    <main className="content" key={selectedMenu}>
      {selectedMenu === "Notes" && <NotesPage notes={notes} />}
      {selectedMenu === "Etudiants" && <StudentsPage students={students} />}
      {selectedMenu === "Matières" && <CoursesPage courses={courses} />}
      {selectedMenu === "A propos" && <AboutPage />}
    </main>
  );
}

export default Content;
