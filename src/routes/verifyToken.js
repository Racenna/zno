const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json({ message: "Access denied" });

    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifyed;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};
