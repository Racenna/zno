const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.get("/getUserData", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");
    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ _id: verifyed._id });

    if (!user) res.status(400).json({ Error: "error" });

    const activeUser = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      ot: user.ot,
      group: user.group
    };
    res.status(200).json(activeUser);
  } catch (error) {
    res.status(500).json("😅Something went wrong");
  }
});

router.put("/updateUserData", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json("Access denied");
    const userID = jwt.verify(token, process.env.TOKEN_SECRET);
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
