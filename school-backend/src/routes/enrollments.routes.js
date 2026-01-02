const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Enrollment = require("../models/Enrollment");

const router = express.Router();

const schemaCreate = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  anneeAcademique: z.string().min(1),
  statut: z.enum(["EN_ATTENTE", "VALIDE", "ANNULE"]).optional().default("VALIDE"),
  dateInscription: z.string().optional(), // yyyy-mm-dd
  actif: z.boolean().optional().default(true),
  semestre: z.enum(["S1", "S2"]).optional().default("S1")
});

const schemaUpdate = schemaCreate.partial();

const toClient = (doc) => {
  // doc peut être Mongoose doc ou objet lean()
  const o = doc?.toObject ? doc.toObject() : doc;
  return {
    ...o,
    // ✅ ton frontend utilise en.student / en.course
    student: o.studentId,
    course: o.courseId
  };
};

router.get("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const items = await Enrollment.find()
      .populate("studentId")
      .populate("courseId")
      .sort({ createdAt: -1 });

    res.json(items.map(toClient));
  } catch (e) { next(e); }
});

router.get("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const item = await Enrollment.findById(req.params.id)
      .populate("studentId")
      .populate("courseId");

    if (!item) return res.status(404).json({ message: "Enrollment not found" });
    res.json(toClient(item));
  } catch (e) { next(e); }
});

router.post("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);

    const created = await Enrollment.create({
      ...body,
      dateInscription: body.dateInscription ? new Date(body.dateInscription) : new Date()
    });

    const full = await Enrollment.findById(created._id)
      .populate("studentId")
      .populate("courseId");

    res.status(201).json(toClient(full));
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Déjà inscrit pour cette période." });
    next(e);
  }
});

router.put("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaUpdate.parse(req.body);

    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        ...(body.dateInscription ? { dateInscription: new Date(body.dateInscription) } : {})
      },
      { new: true }
    ).populate("studentId").populate("courseId");

    if (!updated) return res.status(404).json({ message: "Enrollment not found" });
    res.json(toClient(updated));
  } catch (e) { next(e); }
});

router.delete("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
