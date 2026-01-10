const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(3)
    });

    const { email, password } = schema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() }).populate("studentId");
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    if (user.blocked) return res.status(403).json({ message: "Votre compte est bloqué ou suspendu. Veuillez contacter l'administrateur ou le responsable de l'école." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      studentId: user.studentId ? (user.studentId._id?.toString?.() || user.studentId.toString()) : null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    res.json({ token, user: payload });
  } catch (e) {
    next(e);
  }
});

// ✅ UNE SEULE ROUTE /me (auth middleware)
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).populate("studentId");
    if (!user) return res.status(404).json({ message: "User not found" });

    const out = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      studentId: user.studentId ? (user.studentId._id?.toString?.() || user.studentId.toString()) : null,
      name: user.name || "",
      avatar: user.avatar || ""
    };

    return res.json({ user: out });
  } catch (e) {
    next(e);
  }
});

// PUT /me -> update profile (name, avatar)
router.put("/me", auth, async (req, res, next) => {
  try {
    const schemaUpdate = z.object({
      name: z.string().optional(),
      avatar: z.string().optional()
    });

    const body = schemaUpdate.parse(req.body);

    const updated = await User.findByIdAndUpdate(req.user.sub, body, { new: true }).select("-passwordHash").populate("studentId");
    if (!updated) return res.status(404).json({ message: "User not found" });

    const out = {
      sub: updated._id.toString(),
      email: updated.email,
      role: updated.role,
      studentId: updated.studentId ? (updated.studentId._id?.toString?.() || updated.studentId.toString()) : null,
      name: updated.name || "",
      avatar: updated.avatar || ""
    };

    return res.json({ user: out });
  } catch (e) {
    next(e);
  }
});

// POST /change-password -> change current user's password
router.post("/change-password", auth, async (req, res, next) => {
  try {
    const schema = z.object({
      oldPassword: z.string().optional(),
      newPassword: z.string().min(6)
    });

    const { oldPassword, newPassword } = schema.parse(req.body);

    const u = await User.findById(req.user.sub);
    if (!u) return res.status(404).json({ message: "User not found" });

    // if user has an existing password, require oldPassword
    if (u.passwordHash) {
      if (!oldPassword) return res.status(400).json({ message: "Ancien mot de passe requis" });
      const ok = await bcrypt.compare(oldPassword, u.passwordHash);
      if (!ok) return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    u.passwordHash = await bcrypt.hash(newPassword, 10);
    await u.save();

    res.json({ message: "Mot de passe changé avec succès" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
