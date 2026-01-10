const express = require("express");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Grade = require("../models/Grade");
const User = require("../models/User");

const router = express.Router();

router.get("/", auth, authorize(["ADMIN", "SCOLARITE", "STUDENT"]), async (req, res, next) => {
  try {
    const role = req.user.role;
    const studentId = req.user.studentId;

    // ===== ADMIN : vision globale =====
    if (role === "ADMIN") {
      const [students, courses, enrollments, grades, users] = await Promise.all([
        Student.countDocuments(),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Grade.countDocuments(),
        User.countDocuments()
      ]);

      // Chart: enrollments par statut
      const enrByStatutAgg = await Enrollment.aggregate([
        { $group: { _id: "$statut", total: { $sum: 1 } } }
      ]);
      const enrollmentsByStatut = ["EN_ATTENTE", "VALIDE", "ANNULE"].map((k) => {
        const row = enrByStatutAgg.find((x) => x._id === k);
        return { name: k, value: row ? row.total : 0 };
      });

      // Chart: notes par tranche
      const gradesAgg = await Grade.aggregate([
        {
          $project: {
            pct: {
              $cond: [
                { $gt: ["$sur", 0] },
                { $multiply: [{ $divide: ["$note", "$sur"] }, 100] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ["$pct", 80] }, then: ">= 80%" },
                  { case: { $gte: ["$pct", 60] }, then: "60-79%" },
                  { case: { $gte: ["$pct", 40] }, then: "40-59%" }
                ],
                default: "< 40%"
              }
            },
            total: { $sum: 1 }
          }
        }
      ]);
      const gradesByRange = [">= 80%", "60-79%", "40-59%", "< 40%"].map((k) => {
        const row = gradesAgg.find((x) => x._id === k);
        return { name: k, value: row ? row.total : 0 };
      });

      return res.json({
        role,
        kpis: { students, courses, enrollments, grades, users },
        charts: { enrollmentsByStatut, gradesByRange }
      });
    }

    // ===== SCOLARITE : étudiants + cours + notes uniquement =====
    if (role === "SCOLARITE") {
      const [students, courses, grades] = await Promise.all([
        Student.countDocuments(),
        Course.countDocuments(),
        Grade.countDocuments()
      ]);

      // Chart: notes par tranche (global scolarité)
      const gradesAgg = await Grade.aggregate([
        {
          $project: {
            pct: {
              $cond: [
                { $gt: ["$sur", 0] },
                { $multiply: [{ $divide: ["$note", "$sur"] }, 100] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ["$pct", 80] }, then: ">= 80%" },
                  { case: { $gte: ["$pct", 60] }, then: "60-79%" },
                  { case: { $gte: ["$pct", 40] }, then: "40-59%" }
                ],
                default: "< 40%"
              }
            },
            total: { $sum: 1 }
          }
        }
      ]);
      const gradesByRange = [">= 80%", "60-79%", "40-59%", "< 40%"].map((k) => {
        const row = gradesAgg.find((x) => x._id === k);
        return { name: k, value: row ? row.total : 0 };
      });

      // Chart: notes par filière (bar)
      const gradesByFiliereAgg = await Grade.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "student"
          }
        },
        { $unwind: "$student" },
        { $group: { _id: "$student.filiere", total: { $sum: 1 } } }
      ]);

      const gradesByFiliere = gradesByFiliereAgg.map((x) => ({
        name: x._id || "N/A",
        value: x.total
      }));

      return res.json({
        role,
        kpis: { students, courses, grades },
        charts: { gradesByRange, gradesByFiliere }
      });
    }

    // ===== STUDENT : uniquement son dossier =====
    if (role === "STUDENT") {
      if (!studentId) {
        return res.status(403).json({ message: "Student profile not linked" });
      }

      const studentObjectId = new mongoose.Types.ObjectId(studentId);

      const [myGrades, myEnrollments] = await Promise.all([
        Grade.countDocuments({ studentId: studentObjectId }),
        Enrollment.countDocuments({ studentId: studentObjectId })
      ]);

      // Chart: notes par tranche (pour lui)
      const gradesAgg = await Grade.aggregate([
        { $match: { studentId: studentObjectId } },
        {
          $project: {
            pct: {
              $cond: [
                { $gt: ["$sur", 0] },
                { $multiply: [{ $divide: ["$note", "$sur"] }, 100] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ["$pct", 80] }, then: ">= 80%" },
                  { case: { $gte: ["$pct", 60] }, then: "60-79%" },
                  { case: { $gte: ["$pct", 40] }, then: "40-59%" }
                ],
                default: "< 40%"
              }
            },
            total: { $sum: 1 }
          }
        }
      ]);
      const gradesByRange = [">= 80%", "60-79%", "40-59%", "< 40%"].map((k) => {
        const row = gradesAgg.find((x) => x._id === k);
        return { name: k, value: row ? row.total : 0 };
      });

      // Chart: inscriptions par statut (pour lui)
      const enrByStatutAgg = await Enrollment.aggregate([
        { $match: { studentId: studentObjectId } },
        { $group: { _id: "$statut", total: { $sum: 1 } } }
      ]);
      const enrollmentsByStatut = ["EN_ATTENTE", "VALIDE", "ANNULE"].map((k) => {
        const row = enrByStatutAgg.find((x) => x._id === k);
        return { name: k, value: row ? row.total : 0 };
      });

      return res.json({
        role,
        kpis: { myEnrollments, myGrades },
        charts: { enrollmentsByStatut, gradesByRange }
      });
    }

    return res.status(403).json({ message: "Accès interdit" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
