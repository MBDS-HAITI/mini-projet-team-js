// src/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Student = require("./models/Student");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");
const Grade = require("./models/Grade");
const User = require("./models/User");

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI manquant dans .env");

  await mongoose.connect(uri);

  console.log("DB name:", mongoose.connection.name);
  console.log("User collection:", User.collection.name);
  console.log("✅ MongoDB connected (seed)");

  // ✅ IMPORTANT: supprimer l'ancien index unique qui casse le seed (null/null)
  // (si index inexistant, on ignore)
  try {
    await mongoose.connection.collection(User.collection.name).dropIndex("oauthProvider_1_oauthId_1");
    console.log("🧹 dropped index: oauthProvider_1_oauthId_1");
  } catch (e) {
    // ignore si l'index n'existe pas
  }
}

async function resetCollections() {
  const db = mongoose.connection.db;
  const cols = await db.listCollections().toArray();
  const names = new Set(cols.map((c) => c.name));

  const drop = async (name) => {
    if (names.has(name)) {
      await db.dropCollection(name);
      console.log(`🧹 dropped: ${name}`);
    }
  };

  // drop dans l'ordre (dépendances d'abord)
  await drop(Grade.collection.name);
  await drop(Enrollment.collection.name);
  await drop(User.collection.name);
  await drop(Course.collection.name);
  await drop(Student.collection.name);
}

async function ensureIndexes() {
  await Promise.all([
    Student.syncIndexes(),
    Course.syncIndexes(),
    Enrollment.syncIndexes(),
    Grade.syncIndexes(),
    User.syncIndexes()
  ]);
  console.log("✅ indexes synced");
}

async function seed() {
  // ---------------- STUDENTS ----------------
  const students = await Student.insertMany([
    {
      matricule: "ST-0001",
      prenom: "Jean",
      nom: "Pierre",
      email: "jean.pierre@student.com",
      niveau: "L1",
      filiere: "Informatique",
      actif: true
    },
    {
      matricule: "ST-0002",
      prenom: "Marie",
      nom: "Louis",
      email: "marie.louis@student.com",
      niveau: "L1",
      filiere: "Informatique",
      actif: true
    },
    {
      matricule: "ST-0003",
      prenom: "Daniel",
      nom: "Joseph",
      email: "daniel.joseph@student.com",
      niveau: "L2",
      filiere: "Gestion",
      actif: true
    }
  ]);
  const [s1, s2, s3] = students;
  console.log(`✅ students: ${students.length}`);

  // ---------------- COURSES ----------------
  const courses = await Course.insertMany([
    {
      code: "INF101",
      titre: "Programmation 1",
      credit: 3,
      niveau: "L1",
      filiere: "Informatique",
      description: "Bases de programmation",
      actif: true
    },
    {
      code: "INF102",
      titre: "Algorithmique",
      credit: 3,
      niveau: "L1",
      filiere: "Informatique",
      description: "Algorithmes & structures",
      actif: true
    },
    {
      code: "GES201",
      titre: "Comptabilité",
      credit: 3,
      niveau: "L2",
      filiere: "Gestion",
      description: "Intro comptabilité",
      actif: true
    }
  ]);
  const [c1, c2, c3] = courses;
  console.log(`✅ courses: ${courses.length}`);

  // ---------------- ENROLLMENTS ----------------
  const anneeAcademique = "2025-2026";
  const enrollments = await Enrollment.insertMany([
    {
      studentId: s1._id,
      courseId: c1._id,
      anneeAcademique,
      statut: "VALIDE",
      dateInscription: new Date("2025-09-10"),
      actif: true,
      semestre: "S1"
    },
    {
      studentId: s1._id,
      courseId: c2._id,
      anneeAcademique,
      statut: "EN_ATTENTE",
      dateInscription: new Date("2025-09-11"),
      actif: true,
      semestre: "S1"
    },
    {
      studentId: s2._id,
      courseId: c1._id,
      anneeAcademique,
      statut: "VALIDE",
      dateInscription: new Date("2025-09-09"),
      actif: true,
      semestre: "S1"
    },
    {
      studentId: s3._id,
      courseId: c3._id,
      anneeAcademique,
      statut: "VALIDE",
      dateInscription: new Date("2025-09-08"),
      actif: true,
      semestre: "S1"
    }
  ]);
  console.log(`✅ enrollments: ${enrollments.length}`);

  // ---------------- GRADES ----------------
  const grades = await Grade.insertMany([
    {
      studentId: s1._id,
      courseId: c1._id,
      periode: `${anneeAcademique} S1`,
      note: 85,
      sur: 100,
      appreciation: "Très bien",
      actif: true
    },
    {
      studentId: s2._id,
      courseId: c1._id,
      periode: `${anneeAcademique} S1`,
      note: 72,
      sur: 100,
      appreciation: "Bien",
      actif: true
    },
    {
      studentId: s3._id,
      courseId: c3._id,
      periode: `${anneeAcademique} S1`,
      note: 64,
      sur: 100,
      appreciation: "Assez bien",
      actif: true
    }
  ]);
  console.log(`✅ grades: ${grades.length}`);

  // ---------------- USERS ----------------
  const passwordHash = await bcrypt.hash("1234", 10);

  const users = await User.insertMany([
    // comptes staff
    { email: "admin@school.com", passwordHash, role: "ADMIN", studentId: null },
    { email: "scolarite@school.com", passwordHash, role: "SCOLARITE", studentId: null },

    // comptes étudiants (liés à Student)
    { email: "jean.pierre@student.com", passwordHash, role: "STUDENT", studentId: s1._id },
    { email: "marie.louis@student.com", passwordHash, role: "STUDENT", studentId: s2._id }
  ]);
  console.log(`✅ users: ${users.length}`);

  console.log("\n🎉 SEED OK !");
  console.log("🔑 Logins (password = 1234):");
  console.log(" - admin@school.com (ADMIN)");
  console.log(" - scolarite@school.com (SCOLARITE)");
  console.log(" - jean.pierre@student.com (STUDENT)");
  console.log(" - marie.louis@student.com (STUDENT)");
}

(async function main() {
  try {
    await connect();
    await resetCollections();
    await ensureIndexes();
    await seed();
  } catch (e) {
    console.error("❌ Seed error:", e);
    if (e?.writeErrors) console.error("writeErrors:", e.writeErrors.map((w) => w.errmsg));
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("✅ disconnected");
  }
})();
