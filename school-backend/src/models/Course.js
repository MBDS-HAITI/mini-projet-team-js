const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true, trim: true },
    titre: { type: String, required: true, trim: true },
    credit: { type: Number, default: 0 },
    niveau: { type: String, required: true, trim: true },
    filiere: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
