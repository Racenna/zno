const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/getAllStudents", verify, async (req, res) => {
  try {
    const students = await User.find(
      { status: "Student" },
      { verifyed: 0, status: 0, email: 0, password: 0 }
    );

    res.status(200).json({ message: "Query complet", students });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getByGroup/:group", verify, async (req, res) => {
  try {
    const students = await User.find(
      { group: req.params.group },
      { verifyed: 0, status: 0, email: 0, password: 0 }
    );

    res.status(200).json({ message: "Query complet", students });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
