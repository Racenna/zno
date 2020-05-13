const jwt = require("jsonwebtoken");
// Models
const User = require("../model/User");

module.exports = async function (req, res, next) {
  try {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json({ message: "Access denied" });

    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById({ _id: verifyed._id });

    if (!user)
      return res.status(401).json({ message: "Authorization does not exist" });

    if (!user.sessions.includes(verifyed.sessionId))
      return res.status(401).json({ message: "Authorization expired" });

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};
