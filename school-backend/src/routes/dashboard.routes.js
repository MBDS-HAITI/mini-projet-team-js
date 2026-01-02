const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Grade = require("../models/Grade");

const router = express.Router();

router.get("/", auth, authorize(["ADMIN", "SCOLARITE", "STUDENT"]), async (req, res, next) => {
  try {
    const role = req.user.role;
    const studentId = req.user.studentId;

    // base scope
    const gradeFilter = role === "STUDENT" && studentId ? { studentId } : {};
    const enrFilter = role === "STUDENT" && studentId ? { studentId } : {};

    const [studentsCount, coursesCount, enrollmentsCount, gradesCount] = await Promise.all([
      role === "ADMIN" ? Student.countDocuments() : Student.countDocuments(), // SCOLARITE voit étudiants aussi
      (role === "ADMIN" || role === "SCOLARITE") ? Course.countDocuments() : Course.countDocuments(), // STUDENT peut voir cours aussi si tu veux
      Enrollment.countDocuments(enrFilter),
      Grade.countDocuments(gradeFilter)
    ]);

    // bar chart: inscriptions par statut
    const enrByStatutAgg = await Enrollment.aggregate([
      { $match: enrFilter },
      { $group: { _id: "$statut", total: { $sum: 1 } } }
    ]);
    const enrollmentsByStatut = ["EN_ATTENTE", "VALIDE", "ANNULE"].map((k) => {
      const row = enrByStatutAgg.find(x => x._id === k);
      return { name: k, value: row ? row.total : 0 };
    });

    // pie chart: notes par tranche
    const gradesAgg = await Grade.aggregate([
      { $match: gradeFilter },
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
      const row = gradesAgg.find(x => x._id === k);
      return { name: k, value: row ? row.total : 0 };
    });

    res.json({
      role,
      kpis: {
        students: studentsCount,
        courses: coursesCount,
        enrollments: enrollmentsCount,
        grades: gradesCount
      },
      charts: {
        enrollmentsByStatut,
        gradesByRange
      }
    });
  } catch (e) { next(e); }
});

module.exports = router;
