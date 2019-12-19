const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.post("/test", verify, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "email is not found" });
  res.json(user);
});

module.exports = router;
