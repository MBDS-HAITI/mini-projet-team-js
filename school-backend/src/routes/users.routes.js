const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const User = require("../models/User");
const Student = require("../models/Student");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const schemaCreate = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SCOLARITE", "STUDENT"]),
  studentId: z.string().nullable().optional().default(null),
  blocked: z.boolean().optional().default(false)
});

// list
router.get("/", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const items = await User.find().select("-passwordHash").populate("studentId").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

// details
router.get("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const item = await User.findById(req.params.id).select("-passwordHash").populate("studentId");
    if (!item) return res.status(404).json({ message: "User not found" });
    res.json(item);
  } catch (e) { next(e); }
});

// create
router.post("/", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);
    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const created = await User.create({
      email: body.email.toLowerCase(),
      passwordHash,
      role: body.role,
      studentId: body.studentId || null,
      blocked: body.blocked || false
    });

    const full = await User.findById(created._id).select("-passwordHash").populate("studentId");
    res.status(201).json(full);
  } catch (e) { next(e); }
});

// update
router.put("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const schemaUpdate = z.object({
      email: z.string().email().optional(),
      role: z.enum(["ADMIN", "SCOLARITE", "STUDENT"]).optional(),
      studentId: z.string().nullable().optional(),
      password: z.string().min(6).optional(),
      blocked: z.boolean().optional()
    });

    const body = schemaUpdate.parse(req.body);
    const update = {};

    if (body.email) update.email = body.email.toLowerCase();
    if (body.role) update.role = body.role;
    if (body.studentId !== undefined) update.studentId = body.studentId;
    if (body.password) update.passwordHash = await bcrypt.hash(body.password, 10);

    // fetch old to detect studentId change
    const old = await User.findById(req.params.id).populate("studentId");

    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select("-passwordHash")
      .populate("studentId");

    if (!updated) return res.status(404).json({ message: "User not found" });

    // If studentId was added/changed to a non-null value, send notification to student
    try {
      if (body.studentId && String(old?.studentId?._id || old?.studentId || "") !== String(body.studentId)) {
        const s = await Student.findById(body.studentId);
        if (s) {
          const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
          await sendMail({
            to: s.email,
            subject: "Votre compte a été lié par l'administration - School App",
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h3>Bonjour ${s.prenom || s.email},</h3>
                <p>Votre dossier a été lié à un compte utilisateur par l'administration. Vous pouvez maintenant vous connecter ou lier votre compte OAuth.</p>
                <p>Se connecter : <a href="${frontend}/login">${frontend}/login</a></p>
              </div>
            `,
            text: `Bonjour ${s.prenom || s.email},\n\nVotre dossier a été lié à un compte utilisateur par l'administration. Se connecter: ${frontend}/login`
          });
        }
      }
    } catch (e) {
      console.log("❌ Mail sending after user update failed:", e.message || e);
    }

    res.json(updated);
  } catch (e) { next(e); }
});

// delete
router.delete("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// block / unblock endpoints
router.post("/:id/block", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true }).select("-passwordHash").populate("studentId");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.post("/:id/unblock", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true }).select("-passwordHash").populate("studentId");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

module.exports = router;
