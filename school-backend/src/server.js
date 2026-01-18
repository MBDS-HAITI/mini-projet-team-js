require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { connectDb } = require("./config/db");
const passport = require("passport");

require("./config/passport");

// Redis session store setup
let RedisStore, redisClient;
const useRedis = process.env.REDIS_URL && process.env.NODE_ENV !== "test";

if (useRedis) {
  RedisStore = require("connect-redis").default;
  const { createClient } = require("redis");

  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("❌ Redis: Max reconnection attempts reached");
          return new Error("Redis reconnection failed");
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
  redisClient.on("connect", () => console.log("✅ Redis connected"));
  redisClient.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));
  redisClient.on("ready", () => console.log("✅ Redis ready"));

  // Connect to Redis
  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error("❌ Failed to connect to Redis:", err);
    }
  })();
}

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

// Session configuration with Redis support
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
};

// Use Redis store if available, otherwise fall back to MemoryStore
if (useRedis && redisClient) {
  sessionConfig.store = new RedisStore({
    client: redisClient,
    prefix: "school-session:",
    ttl: 60 * 60 * 24 * 7 // 7 days in seconds
  });
  console.log("✅ Using Redis session store");
} else {
  console.log("⚠️  Using in-memory session store (not recommended for production)");
}

app.use(session(sessionConfig));

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
