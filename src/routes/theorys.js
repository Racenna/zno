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
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

// PUT /api/theory/update
router.put("/update/:id", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Only a teacher can change theory" });

    if (!user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const oldTheory = await Theory.findOne({ _id: req.params.id });

    const tests = await Test.find({
      theme: req.body.theme.toUpperCase() || oldTheory.theme.toUpperCase(),
    });

    const theory = await Theory.findOneAndUpdate(
      { _id: req.params.id },
      {
        theme: req.body.theme.toUpperCase() || oldTheory.theme.toUpperCase(),
        name: req.body.name || oldTheory.name,
        image: req.body.image || oldTheory.image,
        text: req.body.text || oldTheory.text,
        tests,
      }
    );

    if (!theory) return res.status(400).json({ message: "Theory not found" });

    await theory.save();

    res.status(200).json({ message: "Theory updated" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

// POST /api/theory/add
router.post("/add", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.status !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theory" });

    if (!user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const tests = await Test.find({ theme: req.body.theme.toUpperCase() });

    const theoryExist = await Theory.findOne({
      theme: req.body.theme.toUpperCase(),
    });

    if (theoryExist) {
      return res.status(400).json({ message: "Theory already added" });
    }

    const theory = new Theory({
      theme: req.body.theme.toUpperCase(),
      name: req.body.name,
      image: req.body.image,
      text: req.body.text,
      tests,
    });

    await theory.save();

    res.status(200).json({ message: "Theory added" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
