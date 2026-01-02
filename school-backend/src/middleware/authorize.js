module.exports = function authorize(roles = []) {
  return (req, res, next) => {
    // ✅ req.user doit être rempli par auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // si pas de roles spécifiés => tout le monde passe
    if (!roles.length) return next();

    const userRole = req.user.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    next();
  };
};
