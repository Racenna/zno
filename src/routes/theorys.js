const router = require("express").Router();
const verify = require("./verifyToken");
const Theory = require("../model/Theory");
const Test = require("../model/Tests");
const User = require("../model/User");

// GET /api/theory
router.get("/", verify, async (req, res) => {
  try {
    const theory = await Theory.find();

    res.status(200).json(theory);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// PUT /api/theory/update
router.put("/update", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.group !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theory" });

    const tests = await Test.find({ theme: req.body.theme });
    await Theory.findOneAndUpdate(req.body.oldTheme, {
      theme: req.body.theme,
      text: req.body.text,
      tests
    });

    res.status(200).json({ message: "Theory updated" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// POST /api/theory/add
router.post("/add", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.group !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theory" });
    const tests = await Test.find({ theme: req.body.theme });

    const theory = new Theory({
      theme: req.body.theme,
      text: req.body.text,
      tests
    });

    await theory.save();

    res.status(200).json({ message: "Theory added" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", error: err });
  }
});

module.exports = router;
