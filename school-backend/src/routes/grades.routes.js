const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Grade = require("../models/Grade");

const router = express.Router();

const schemaCreate = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  periode: z.string().min(1),
  note: z.number().min(0),
  sur: z.number().min(1).optional().default(100),
  appreciation: z.string().optional().default(""),
  actif: z.boolean().optional().default(true)
});

const schemaUpdate = schemaCreate.partial();

const toClient = (doc) => {
  const o = doc?.toObject ? doc.toObject() : doc;
  return {
    ...o,
    student: o.studentId,
    course: o.courseId
  };
};

// ADMIN/SCOLARITE : liste toutes les notes
router.get("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const items = await Grade.find()
      .populate("studentId")
      .populate("courseId")
      .sort({ createdAt: -1 });

    res.json(items.map(toClient));
  } catch (e) { next(e); }
});

// STUDENT : ses notes
router.get("/me", auth, authorize(["STUDENT"]), async (req, res, next) => {
  try {
    const studentId = req.user?.studentId;
    if (!studentId) return res.json([]);

    const items = await Grade.find({ studentId })
      .populate("studentId")
      .populate("courseId")
      .sort({ createdAt: -1 });

      // renvoie student + course (comme ton front attend)
    const mapped = items.map(g => ({
      ...g.toObject(),
      student: g.studentId,
      course: g.courseId,
      studentId: g.studentId?._id,
      courseId: g.courseId?._id
    }));

    res.json(mapped);
  } catch (e) { next(e); }
});

router.get("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const item = await Grade.findById(req.params.id)
      .populate("studentId")
      .populate("courseId");

    if (!item) return res.status(404).json({ message: "Grade not found" });
    res.json(toClient(item));
  } catch (e) { next(e); }
});

router.post("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);
    const created = await Grade.create(body);

    const full = await Grade.findById(created._id)
      .populate("studentId")
      .populate("courseId");

    res.status(201).json(toClient(full));
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Note déjà existante pour cette période." });
    next(e);
  }
});

router.put("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaUpdate.parse(req.body);

    const updated = await Grade.findByIdAndUpdate(req.params.id, body, { new: true })
      .populate("studentId")
      .populate("courseId");

    if (!updated) return res.status(404).json({ message: "Grade not found" });
    res.json(toClient(updated));
  } catch (e) { next(e); }
});

router.delete("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
