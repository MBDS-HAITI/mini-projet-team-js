require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { connectDb } = require("./config/db");
const passport = require("passport");

require("./config/passport");

const adminUsersRoutes = require("./routes/admin.users.routes");

const authRoutes = require("./routes/auth.routes");
const oauthRoutes = require("./routes/oauth.routes");
const studentsRoutes = require("./routes/students.routes");
const coursesRoutes = require("./routes/courses.routes");
const enrollmentsRoutes = require("./routes/enrollments.routes");
const gradesRoutes = require("./routes/grades.routes");
const usersRoutes = require("./routes/users.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ gestion erreurs propre
app.use((err, req, res, next) => {
  console.error(err);

  if (err?.issues) {
    return res.status(400).json({ message: "Validation error", details: err.issues });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: "Duplicate key", details: err.keyValue });
  }

  res.status(err.status || 400).json({ message: err.message || "Erreur" });
});

(async () => {
  try {
    await connectDb(process.env.MONGODB_URI);
    const port = process.env.PORT || 7010;
    app.listen(port, () => console.log(`✅ API running on http://localhost:${port}`));
  } catch (e) {
    console.error("❌ Failed to start server:", e);
  }
})();
