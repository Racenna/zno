const router = require("express").Router();
const Tests = require("../model/Tests");

router.post("/createTest", async (req, res) => {
  const test = new Tests({
    name: req.body.test.name,
    theme: req.body.test.theme,
    questions: req.body.test.questions
  });

  try {
    await test.save();
    res.status(200).json({ message: "compleate" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/getTest", async (req, res) => {
  // const user = await User.findOne({ email: req.query.email });
  const test = await Tests.findOne({ name: req.query.name });
  if (!test) return res.json({ message: "something wrong" });
  else res.json({ test });
});

module.exports = router;
