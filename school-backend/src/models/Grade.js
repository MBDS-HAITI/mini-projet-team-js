const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // ex: "2024-2025 S1" ou "2024-2025" (choisis ton format)
    periode: { type: String, required: true },

    note: { type: Number, min: 0, required: true },
    sur: { type: Number, min: 1, default: 100 },
    appreciation: { type: String, default: "" },

    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// une seule note par student+course+periode
gradeSchema.index({ studentId: 1, courseId: 1, periode: 1 }, { unique: true });

module.exports = mongoose.model("Grade", gradeSchema);
