const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.get("/getUserData", verify, async (req, res) => {
  const token = req.header("auth-token");
  const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: verifyed._id });
  const activeUser = {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    ot: user.ot,
    group: user.group
  };
  res.json(activeUser);
});

router.put("/updateUserData", verify, async (req, res) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");
  const userID = jwt.verify(token, process.env.TOKEN_SECRET);
  try {
    await User.findByIdAndUpdate(userID, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      ot: req.body.ot
    });
    res.status(200).json({ message: "User data was updated" });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

module.exports = router;
