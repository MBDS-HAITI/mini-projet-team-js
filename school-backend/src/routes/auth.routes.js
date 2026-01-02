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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      studentId: user.studentId ? user.studentId.toString() : null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    res.json({ token, user: payload });
  } catch (e) {
    next(e);
  }
});

const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  // req.user = payload JWT
  res.json({ user: req.user });
});


module.exports = router;
