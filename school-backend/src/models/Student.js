const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    matricule: { type: String, unique: true, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    niveau: { type: String, default: "" },
    filiere: { type: String, default: "" },
    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
