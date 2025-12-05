import StudentsPage from "./StudentsPage";
import CoursesPage from "./CoursesPage";
import NotesPage from "./NotesPage";
import AboutPage from "./AboutPage";
import { Routes, Route } from "react-router-dom";
import NoteDetailsPage from "./components/NoteDetailsPage";
import Home from "./Home";

function Menu()
{
    return (
        <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<NotesPage notes={notes} />} />
            <Route path="/notes/:id" element={<NoteDetailsPage />} />
            <Route path="/dashboard" element={<DashboardPage notes={notes} />} />
            <Route path="/students" element={<StudentsPage students={students} />} />
            <Route path="/courses" element={<CoursesPage courses={courses} />} />
            <Route path="/about" element={<AboutPage />} />
        </Routes>
        </>
    );
}