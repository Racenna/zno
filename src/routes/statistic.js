const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const User = require("../model/User");
const GeneralStatistic = require("../model/GeneralStatistic");
const QuestionsStatistic = require("../model/QuestionsStatistic");

router.post("/generalStatistic", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json("Access denied");

    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ _id: verifyed._id });

    if (!user) return res.status(400).json("User not found");

    const statistic = new GeneralStatistic({
      firstname: user.firstname,
      lastname: user.lastname,
      ot: user.ot,
      group: user.group,
      testID: req.body.testID,
      result: req.body.result,
      date: req.body.date
    });

    await statistic.save();
    res.status(200).json({ message: "compleate" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/questionsStatistic", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json("Access denied");

    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ _id: verifyed._id });

    if (!user) return res.status(400).json("User not found");

    const statistic = new QuestionsStatistic({
      firstname: user.firstname,
      lastname: user.lastname,
      ot: user.ot,
      group: user.group,
      questionID: req.body.questionID,
      result: req.body.result,
      date: req.body.date
    });

    await statistic.save();
    res.status(200).json({ message: "compleate" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
