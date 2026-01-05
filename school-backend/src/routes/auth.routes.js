const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");

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

router.get("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // (optionnel) récupérer user DB si tu veux plus d’infos
    const user = await User.findById(payload.sub).populate("studentId");
    if (!user) return res.status(404).json({ message: "User not found" });

    // renvoyer un objet user propre (comme login)
    const out = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      studentId: user.studentId ? (user.studentId._id?.toString?.() || user.studentId.toString()) : null
    };

    return res.json({ user: out });
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
});



module.exports = router;
