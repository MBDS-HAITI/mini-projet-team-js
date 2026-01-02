const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const header = req?.headers?.authorization || ""; // ✅ protège si undefined
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, role, studentId }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
