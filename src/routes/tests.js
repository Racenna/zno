const router = require("express").Router();
const Tests = require("../model/Tests");

router.post("/createTest", async (req, res) => {
  try {
    const test = new Tests({
      name: req.body.test.name,
      theme: req.body.test.theme,
      questions: req.body.test.questions
    });

    await test.save();
    res.status(200).json({ message: "compleate" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/getTest", async (req, res) => {
  try {
    const test = await Tests.findOne({ name: req.query.name });
    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
