const router = require("express").Router();
const verify = require("./verifyToken");
// Models
const User = require("../model/User");

router.get("/getByGroup/:group", verify, async (req, res) => {
  try {
    const query = { group: req.params.group };

    const students = await User.find(query, {
      verified: 0,
      status: 0,
      email: 0,
      password: 0,
      activateAccount: 0,
      sessions: 0,
      resetPasswordToken: 0,
      resetPasswordTokenExpires: 0,
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getAllStudents", verify, async (req, res) => {
  try {
    let users;

    if (req.query.group) {
      const query = { group: req.query.group };

      users = await User.find(query, {
        verified: 0,
        status: 0,
        email: 0,
        password: 0,
        activateAccount: 0,
        sessions: 0,
        resetPasswordToken: 0,
        resetPasswordTokenExpires: 0,
      });
    } else {
      users = await User.find(
        {},
        {
          verified: 0,
          status: 0,
          email: 0,
          password: 0,
          activateAccount: 0,
          sessions: 0,
          resetPasswordToken: 0,
          resetPasswordTokenExpires: 0,
        }
      );
    }

    if (req.query.search) {
      users = users.filter((user) =>
        user.lastname.toLowerCase().includes(req.query.search.toLowerCase())
      );
    }

    users = users.filter((user) => user.status !== "Teacher");
    users = users.filter((user) => user.group !== "no group");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
