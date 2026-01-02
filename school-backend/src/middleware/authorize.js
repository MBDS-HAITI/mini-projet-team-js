module.exports = function authorize(roles = []) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: "Non autorisé" });

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};
