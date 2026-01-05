const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport"); // ✅ IMPORTANT (pas ../config/passport)

const router = express.Router();

function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    studentId: user.studentId ? user.studentId.toString() : null
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

function redirectWithToken(res, token) {
  const url = `${process.env.FRONTEND_URL}/oauth/callback?token=${encodeURIComponent(token)}`;
  return res.redirect(url);
}

// ✅ Google (force choix + reauth)
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    prompt: "select_account",
    authType: "reauthenticate" // ✅ attention: authType (pas authtyper)
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?oauth=fail`
  }),
  (req, res) => {
    const token = signToken(req.user);
    redirectWithToken(res, token);
  }
);

module.exports = router;
