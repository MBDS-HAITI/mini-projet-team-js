const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Student = require("../models/Student");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const schemaCreate = z.object({
  matricule: z.string().min(1),
  prenom: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().email(),
  niveau: z.string().optional().default(""),
  filiere: z.string().optional().default(""),
  actif: z.boolean().optional().default(true)
});

const schemaUpdate = schemaCreate.partial();

// ✅ STUDENT : son dossier (mettre AVANT "/:id")
router.get("/me", auth, authorize(["STUDENT"]), async (req, res, next) => {
  try {
    const studentId = req.user.studentId;
    // if (!studentId) return res.status(404).json({ message: "Student profile not linked" });
    if (!studentId) return res.status(403).json({ message: "Student profile not linked" });


    const item = await Student.findById(studentId);
    if (!item) return res.status(404).json({ message: "Student not found" });

    res.json(item);
  } catch (e) { next(e); }
});
// ✅ STUDENT : lier son compte OAuth à un Student existant
router.post("/link-me", auth, authorize(["STUDENT"]), async (req, res, next) => {
  try {
    const schemaLink = z.object({
      studentEmail: z.string().email()
    });

    const { studentEmail } = schemaLink.parse(req.body);

    // user courant (token)
    const userId = req.user.sub; // ton JWT met sub = user._id
    const emailLower = studentEmail.toLowerCase().trim();

    // trouver étudiant
    const s = await Student.findOne({ email: emailLower });
    if (!s) {
      return res.status(400).json({
        message: `Aucun étudiant trouvé avec l'email "${emailLower}". Demande à la scolarité/admin de créer l'étudiant d'abord.`
      });
    }

    // mettre à jour le user: lier studentId
    const u = await User.findById(userId);
    if (!u) return res.status(404).json({ message: "User not found" });

    // sécurité: un compte étudiant ne peut lier qu'un student
    u.studentId = s._id;
    if (!u.email) u.email = emailLower;

    await u.save();

    // envoyer un email de confirmation à l'étudiant et attendre le résultat
    let mailSent = false;
    let mailError = null;
    try {
      const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
      const info = await sendMail({
        to: s.email,
        subject: "Votre compte a été lié - School App",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>Bonjour ${s.prenom || s.email},</h3>
            <p>Votre compte a été lié avec succès à l'authentification (${u.oauthProvider || 'email/password'}). Vous pouvez désormais vous connecter via OAuth et accéder à votre dashboard étudiant.</p>
            <p>Si vous n'avez pas demandé cette liaison, veuillez contacter la scolarité/administration.</p>
            <p>Se connecter : <a href="${frontend}/login">${frontend}/login</a></p>
          </div>
        `,
        text: `Bonjour ${s.prenom || s.email},\n\nVotre compte a été lié avec succès à l'authentification. Si vous n'avez pas demandé cette liaison, contactez la scolarité/administration.\n\nConnexion: ${frontend}/login`
      });

      mailSent = true;
      console.log("✅ Link confirmation mail sent:", info.messageId || info.response);
    } catch (e) {
      mailSent = false;
      mailError = e?.message || String(e);
      console.log("❌ Link confirmation mail failed:", mailError);
    }

    // ✅ signer un nouveau token avec studentId mis à jour
    const jwt = require("jsonwebtoken");
    const payload = {
      sub: u._id.toString(),
      email: u.email,
      role: u.role,
      studentId: u.studentId ? u.studentId.toString() : null
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    // renvoyer user "safe"
    res.json({
      token,
      user: {
        _id: u._id,
        email: u.email,
        role: u.role,
        studentId: u.studentId
      },
      mailSent,
      mailError
    });
  } catch (e) {
    next(e);
  }
});


// LIST: ADMIN + SCOLARITE
router.get("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const items = await Student.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

// GET BY ID: ADMIN + SCOLARITE
router.get("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Student not found" });
    res.json(item);
  } catch (e) { next(e); }
});

router.post("/", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaCreate.parse(req.body);

    const created = await Student.create({
      ...body,
      email: body.email.toLowerCase(),
      matricule: body.matricule.trim()
    });

    // envoyer un mail de notification à l'étudiant pour l'informer que son dossier existe
    let mailSent = false;
    let mailError = null;
    try {
      const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
      const info = await sendMail({
        to: created.email,
        subject: "Votre dossier étudiant a été créé - School App",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>Bonjour ${created.prenom || created.email},</h3>
            <p>Un dossier étudiant a été créé pour vous dans School App.</p>
            <p>Si vous souhaitez lier votre compte (via Google/GitHub), connectez-vous et utilisez la page Lier mon compte.</p>
            <p>Se connecter : <a href="${frontend}/login">${frontend}/login</a></p>
          </div>
        `,
        text: `Bonjour ${created.prenom || created.email},\n\nUn dossier étudiant a été créé pour vous dans School App.\nSe connecter: ${frontend}/login`
      });
      mailSent = true;
      console.log("✅ Student creation mail sent:", info.messageId || info.response);
    } catch (e) {
      mailSent = false;
      mailError = e?.message || String(e);
      console.log("❌ Student creation mail failed:", mailError);
    }

    res.status(201).json({ ...created.toObject(), mailSent, mailError });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Matricule ou email déjà utilisé." });
    next(e);
  }
});

router.put("/:id", auth, authorize(["ADMIN", "SCOLARITE"]), async (req, res, next) => {
  try {
    const body = schemaUpdate.parse(req.body);

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        ...(body.email ? { email: body.email.toLowerCase() } : {}),
        ...(body.matricule ? { matricule: body.matricule.trim() } : {})
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Matricule ou email déjà utilisé." });
    next(e);
  }
});

// suppression seulement ADMIN
router.delete("/:id", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const id = req.params.id;

    await User.updateMany({ studentId: id }, { $set: { studentId: null } });
    await Student.findByIdAndDelete(id);

    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
