const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport"); 

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

// 
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    prompt: "select_account",
    authType: "reauthenticate" 
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

// ---- GitHub
function failRedirect() {
  return `${process.env.FRONTEND_URL}/login?oauth=fail`;
}

router.get("/github", passport.authenticate("github", { session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: failRedirect() }),
  (req, res) => redirectWithToken(res, signToken(req.user))
);

// ---- LinkedIn
router.get("/linkedin", passport.authenticate("linkedin", { session: false }));
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failureRedirect: failRedirect() }),
  (req, res) => redirectWithToken(res, signToken(req.user))
);

// ---- Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
    scope: ["email"] 
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: failRedirect() }),
  (req, res) => redirectWithToken(res, signToken(req.user))
);

module.exports = router;
