const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Student = require("../models/Student");
const User = require("../models/User");

const router = express.Router();

const schemaCreate = z.object({
  matricule: z.string().min(1),
  prenom: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().email(),
  niveau: z.string().optional().default(""),
  filiere: z.string().optional().default(""),
  actif: z.boolean().optional().default(true)
});

const schemaUpdate = schemaCreate.partial();

router.get("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const items = await Student.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.get("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Student not found" });
    res.json(item);
  } catch (e) { next(e); }
});

router.post("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);

    const created = await Student.create({
      ...body,
      email: body.email.toLowerCase(),
      matricule: body.matricule.trim()
    });

    res.status(201).json(created);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Matricule ou email déjà utilisé." });
    next(e);
  }
});

router.put("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaUpdate.parse(req.body);

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        ...(body.email ? { email: body.email.toLowerCase() } : {}),
        ...(body.matricule ? { matricule: body.matricule.trim() } : {})
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Matricule ou email déjà utilisé." });
    next(e);
  }
});

// suppression seulement ADMIN
router.delete("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const id = req.params.id;

    // si un user STUDENT pointe vers ce student, on détache
    await User.updateMany({ studentId: id }, { $set: { studentId: null } });

    await Student.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get("/me", auth, authorize(["STUDENT"]), async (req, res, next) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(404).json({ message: "Student profile not linked" });

    const item = await Student.findById(studentId);
    if (!item) return res.status(404).json({ message: "Student not found" });

    res.json(item);
  } catch (e) { next(e); }
});


module.exports = router;
