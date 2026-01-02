const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // ✅ frontend attend: anneeAcademique, statut, dateInscription
    anneeAcademique: { type: String, required: true }, // ex: 2024-2025
    statut: { type: String, enum: ["EN_ATTENTE", "VALIDE", "ANNULE"], default: "VALIDE" },
    dateInscription: { type: Date, default: Date.now },
    actif: { type: Boolean, default: true },

    // ✅ optionnel (si tu veux garder semestre, mais ton frontend ne l’envoie pas)
    semestre: { type: String, enum: ["S1", "S2"], default: "S1" }
  },
  { timestamps: true }
);

// unique "une inscription" par student+course+annee(+semestre)
enrollmentSchema.index(
  { studentId: 1, courseId: 1, anneeAcademique: 1, semestre: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
