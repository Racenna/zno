const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");
const Tests = require("../model/Tests");

router.post("/createTest", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Only a teacher can create tests" });

    if (!user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access."
      });

    const test = new Tests({
      name: req.body.test.name,
      theme: req.body.test.theme.toUpperCase(),
      questions: req.body.test.questions,
      owner: req.user._id
    });

    await test.save();

    res.status(200).json({ message: "Test created" });
  } catch (error) {
    res.status(500).send({ message: "😅Something went wrong" });
  }
});

router.get("/getTest", verify, async (req, res) => {
  try {
    const test = await Tests.findOne({ name: req.query.name });

    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
