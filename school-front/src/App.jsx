import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthContext } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppShell from "./layout/AppShell";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

import StudentsList from "./pages/students/StudentsList";
import StudentDetails from "./pages/students/StudentsDetails";

import PrintStudentsList from "./pages/print/PrintStudentsList";
import PrintStudentDetails from "./pages/print/PrintStudentDetails";

import CoursesList from "./pages/courses/CoursesList";
import CourseDetails from "./pages/courses/CourseDetails";
import PrintCoursesList from "./pages/print/PrintCoursesList";
import PrintCourseDetails from "./pages/print/PrintCourseDetails";
import PrintStudentBulletin from "./pages/print/PrintStudentBulletin";

import GradesList from "./pages/grades/GradesList";
import GradeDetails from "./pages/grades/GradeDetails";
import PrintGradesList from "./pages/print/PrintGradesList";
import PrintGradeDetails from "./pages/print/PrintGradeDetails";

import EnrollmentsList from "./pages/enrollments/EnrollmentsList";
import EnrollmentDetails from "./pages/enrollments/EnrollmentDetails";
import PrintEnrollmentsList from "./pages/print/PrintEnrollmentsList";
import PrintEnrollmentDetails from "./pages/print/PrintEnrollmentDetails";

import UsersList from "./pages/users/UsersList";
import UserView from "./pages/users/UserView";
import Profile from "./pages/profile/Profile";
import PrintUsersList from "./pages/print/PrintUsersList";
import PrintUserDetails from "./pages/print/PrintUserDetails";

import OAuthCallback from "./pages/auth/OAuthCallback";
import LinkStudentAccount from "./pages/students/LinkStudentAccount";




export default function App() {
  const { user } = useContext(AuthContext);

  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isScolarite = role === "SCOLARITE";
  const isStudent = role === "STUDENT";

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= */}
        {/* PRINT ROUTES (SANS APPSHELL) */}
        {/* ========================= */}
        <Route
          path="/print/students"
          element={
            <ProtectedRoute roles={["ADMIN", "SCOLARITE"]}>
              <PrintStudentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print/students/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "SCOLARITE"]}>
              <PrintStudentDetails />
            </ProtectedRoute>
          }
        />
    <Route
  path="/student/link"
  element={
    <ProtectedRoute roles={["STUDENT"]}>
      <LinkStudentAccount />
    </ProtectedRoute>
  }
/>

    <Route path="/print/bulletin" element={<PrintStudentBulletin />} />


        {/* ========================= */}
        {/* APP ROUTES (AVEC APPSHELL) */}
        {/* ========================= */}
        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />
               <Route
  path="/register"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <Register />
    </ProtectedRoute>
  }
/>


                {/* Home redirect */}
                <Route
                  path="/"
                  element={
                    isAdmin ? <Navigate to="/admin" replace /> :
                    isScolarite ? <Navigate to="/scolarite" replace /> :
                    isStudent ? <Navigate to="/student" replace /> :
                    <Navigate to="/login" replace />
                  }
                />

                {/* Dashboards */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scolarite"
                  element={
                    <ProtectedRoute roles={["SCOLARITE", "ADMIN"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute roles={["STUDENT"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Students */}
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute roles={["ADMIN", "SCOLARITE"]}>
                      <StudentsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students/:id"
                  element={
                    <ProtectedRoute roles={["ADMIN", "SCOLARITE"]}>
                      <StudentDetails />
                    </ProtectedRoute>
                  }
                />

<Route path="/courses" element={<ProtectedRoute roles={["ADMIN", "SCOLARITE"]}><CoursesList /></ProtectedRoute>} />
<Route path="/courses/:id" element={<ProtectedRoute roles={["ADMIN", "SCOLARITE"]}><CourseDetails /></ProtectedRoute>} />
<Route path="/print/courses" element={<ProtectedRoute roles={["ADMIN", "SCOLARITE"]}><PrintCoursesList /></ProtectedRoute>} />
<Route path="/print/courses/:id" element={<ProtectedRoute roles={["ADMIN", "SCOLARITE"]}><PrintCourseDetails /></ProtectedRoute>} />

<Route path="/grades" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><GradesList/></ProtectedRoute>} />
<Route path="/grades/:id" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><GradeDetails/></ProtectedRoute>} />
<Route path="/print/grades" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><PrintGradesList/></ProtectedRoute>} />
<Route path="/print/grades/:id" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><PrintGradeDetails/></ProtectedRoute>} />

<Route path="/enrollments" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><EnrollmentsList/></ProtectedRoute>} />
<Route path="/enrollments/:id" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><EnrollmentDetails/></ProtectedRoute>} />
<Route path="/print/enrollments" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><PrintEnrollmentsList/></ProtectedRoute>} />
<Route path="/print/enrollments/:id" element={<ProtectedRoute roles={["ADMIN","SCOLARITE"]}><PrintEnrollmentDetails/></ProtectedRoute>} />

<Route path="/users" element={<ProtectedRoute roles={["ADMIN"]}><UsersList/></ProtectedRoute>} />
<Route path="/users/:id" element={<ProtectedRoute roles={["ADMIN"]}><UserView/></ProtectedRoute>} />

                <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
<Route path="/print/users" element={<ProtectedRoute roles={["ADMIN"]}><PrintUsersList/></ProtectedRoute>} />
<Route path="/print/users/:id" element={<ProtectedRoute roles={["ADMIN"]}><PrintUserDetails/></ProtectedRoute>} />

 <Route path="/oauth/callback" element={<OAuthCallback />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
