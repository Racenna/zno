const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");
const Tests = require("../model/Tests");

router.post("/createTest", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    if (user.group !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add tests" });

    const test = new Tests({
      name: req.body.test.name,
      theme: req.body.test.theme,
      questions: req.body.test.questions,
      owner: req.user._id
    });

    await test.save();
    res.status(200).json({ message: "compleate" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/getTest", verify, async (req, res) => {
  try {
    const test = await Tests.findOne({ name: req.query.name });
    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
