const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_prod";

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // keep only what you need
    req.user = {
      id: payload.id,
      role: payload.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: admin only" });
  }
  next();
};
