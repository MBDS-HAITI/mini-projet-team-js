const express = require("express");
const { z } = require("zod");
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1)
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post("/send", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schema.parse(req.body);

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: body.to,
      subject: body.subject,
      html: body.html
    });

    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
