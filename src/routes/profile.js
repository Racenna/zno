const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const User = require("../model/User");

router.get("/getUserData", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) res.status(400).json({ message: "User not found" });

    const activeUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      fathername: user.fathername,
      email: user.email,
      group: user.group,
      status: user.status
    };
    res.status(200).json(activeUser);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/updateUserData", verify, async (req, res) => {
  try {
    const oldUserData = await User.findById(req.user._id);

    await User.findByIdAndUpdate(req.user._id, {
      firstname: req.body.firstname || oldUserData.firstname,
      lastname: req.body.lastname || oldUserData.lastname,
      fathername: req.body.fathername || oldUserData.fathername
    });

    res.status(200).json({ message: "User data was updated" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
