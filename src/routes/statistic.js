const router = require("express").Router();
const User = require("../model/User");
const GeneralStatistic = require("../model/GeneralStatistic");
const QuestionsStatistic = require("../model/QuestionsStatistic");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.post("/generalStatistic", verify, async (req, res) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access denied");

  const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: verifyed._id });

  if (!user) return res.status(400).send("User not found");

  const statistic = new GeneralStatistic({
    firstname: user.firstname,
    lastname: user.lastname,
    ot: user.ot,
    group: user.group,
    testID: req.body.testID,
    result: req.body.result,
    date: req.body.date
  });

  try {
    await statistic.save();
    res.status(200).json({ message: "compleate" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post("/questionsStatistic", verify, async (req, res) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access denied");

  const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ _id: verifyed._id });

  if (!user) return res.status(400).send("User not found");

  const statistic = new QuestionsStatistic({
    firstname: user.firstname,
    lastname: user.lastname,
    ot: user.ot,
    group: user.group,
    questionID: req.body.questionID,
    result: req.body.result,
    date: req.body.date
  });

  try {
    await statistic.save();
    res.status(200).json({ message: "compleate" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

module.exports = router;
