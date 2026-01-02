const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Course = require("../models/Course");

const router = express.Router();

const schemaCreate = z.object({
  code: z.string().min(1),
  titre: z.string().min(1),
  credit: z.number().optional().default(0),
  niveau: z.string().min(1),
  filiere: z.string().min(1),
  description: z.string().optional().default(""),
  actif: z.boolean().optional().default(true)
});

const schemaUpdate = schemaCreate.partial();

router.get("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const items = await Course.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.get("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const item = await Course.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Course not found" });
    res.json(item);
  } catch (e) { next(e); }
});

router.post("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);

    const created = await Course.create({
      ...body,
      code: body.code.trim()
    });

    res.status(201).json(created);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Code déjà utilisé." });
    next(e);
  }
});

router.put("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaUpdate.parse(req.body);

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...body, ...(body.code ? { code: body.code.trim() } : {}) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Code déjà utilisé." });
    next(e);
  }
});

// suppression seulement ADMIN
router.delete("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
