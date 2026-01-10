// const express = require("express");
// const bcrypt = require("bcryptjs");
// const { z } = require("zod");

// const auth = require("../middleware/auth");
// const authorize = require("../middleware/authorize");

// const User = require("../models/User");
// const Student = require("../models/Student");
// const { sendMail } = require("../utils/mailer");

// const router = express.Router();

// const schema = z.object({
//   email: z.string().email(),
//   role: z.enum(["ADMIN", "SCOLARITE", "STUDENT"]),
//   studentEmail: z.string().email().optional(), // optionnel si role STUDENT
//   password: z.string().min(4).optional() // si absent => générer
// });

// function genPassword() {
//   return Math.random().toString(36).slice(2, 10) + "A1!";
// }

// router.post("/", auth, authorize(["ADMIN"]), async (req, res, next) => {
//   try {
//     const body = schema.parse(req.body);
//     const email = body.email.toLowerCase().trim();

//     // vérifier existence
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

//     // si STUDENT -> lier studentId si possible (par studentEmail ou par email)
//     let studentId = null;
//     if (body.role === "STUDENT") {
//       const targetEmail = (body.studentEmail || email).toLowerCase();
//       const s = await Student.findOne({ email: targetEmail });
//       if (s) studentId = s._id;
//     }

//     const plainPassword = body.password || genPassword();
//     const passwordHash = await bcrypt.hash(plainPassword, 10);

//     const created = await User.create({
//       email,
//       role: body.role,
//       passwordHash,
//       studentId,
//       oauthProvider: null,
//       oauthId: null,
//       name: "",
//       avatar: ""
//     });

//     // envoyer email
//     const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

//     await sendMail({
//       to: email,
//       subject: "Votre compte School App",
//       html: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>Bienvenue sur School App</h2>
//           <p>Votre compte a été créé par l'administrateur.</p>
//           <p><b>Rôle:</b> ${created.role}</p>
//           <p><b>Email:</b> ${email}</p>
//           <p><b>Mot de passe:</b> ${plainPassword}</p>
//           <p>Connectez-vous ici: <a href="${frontend}/login">${frontend}/login</a></p>
//           <p style="margin-top:16px; font-size:12px; color:#666;">
//             Conseil: changez votre mot de passe après connexion.
//           </p>
//         </div>
//       `,
//       text: `Votre compte School App a été créé.
// Rôle: ${created.role}
// Email: ${email}
// Mot de passe: ${plainPassword}
// Connexion: ${frontend}/login`
//     });

//     res.status(201).json({
//       _id: created._id,
//       email: created.email,
//       role: created.role,
//       studentId: created.studentId
//     });
//   } catch (e) {
//     if (e?.code === 11000) return res.status(409).json({ message: "Email déjà utilisé." });
//     next(e);
//   }
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const User = require("../models/User");
const Student = require("../models/Student");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "SCOLARITE", "STUDENT"]),
  studentEmail: z.string().email().optional(), // optionnel mais recommandé si STUDENT
  password: z.string().min(4).optional()
});

function genPassword() {
  return Math.random().toString(36).slice(2, 10) + "A1!";
}

router.post("/", auth, authorize(["ADMIN"]), async (req, res, next) => {
  try {
    const body = schema.parse(req.body);

    const email = body.email.toLowerCase().trim();
    const role = body.role;

    // vérifier existence
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    // ✅ lier studentId seulement pour STUDENT (obligatoire)
    let studentId = null;

    if (role === "STUDENT") {
      const targetEmail = (body.studentEmail || email).toLowerCase().trim();

      const s = await Student.findOne({ email: targetEmail });

      // ✅ IMPORTANT: refuser si pas trouvé
      if (!s) {
        return res.status(400).json({
          message: `Aucun étudiant trouvé avec l'email "${targetEmail}". Crée d'abord l'étudiant (Students) ou mets studentEmail correct.`
        });
      }

      studentId = s._id;
    }

    const plainPassword = body.password || genPassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const created = await User.create({
      email,
      role,
      passwordHash,
      studentId, // null pour ADMIN/SCOLARITE, ObjectId pour STUDENT
      oauthProvider: null,
      oauthId: null,
      name: "",
      avatar: ""
    });

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

const info = await sendMail({
  to: email,
  subject: "Votre compte School App",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Bienvenue sur School App</h2>
      <p>Votre compte a été créé par l'administrateur.</p>
      <p><b>Rôle:</b> ${created.role}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Mot de passe:</b> ${plainPassword}</p>
      <p>Connectez-vous ici: <a href="${frontend}/login">${frontend}/login</a></p>
      <p style="margin-top:16px; font-size:12px; color:#666;">
        Conseil: changez votre mot de passe après connexion.
      </p>
    </div>
  `,
  text: `Votre compte School App a été créé.
Rôle: ${created.role}
Email: ${email}
Mot de passe: ${plainPassword}
Connexion: ${frontend}/login`
});

console.log("✅ Mail sent:", info.messageId, info.response);
console.log("📩 sending to:", email);


    res.status(201).json({
      _id: created._id,
      email: created.email,
      role: created.role,
      studentId: created.studentId
    });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Email déjà utilisé." });
    next(e);
  }
});

module.exports = router;
