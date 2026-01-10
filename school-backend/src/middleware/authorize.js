module.exports = function authorize(roles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Non autorisé" });

      if (!Array.isArray(roles) || roles.length === 0) return next();

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Accès interdit" });
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};
