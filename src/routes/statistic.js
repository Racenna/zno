const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const User = require("../model/User");
const Test = require("../model/Tests");
const TestStatistics = require("../model/TestStatistics");
const QuestionsStatistic = require("../model/QuestionsStatistic");

router.post("/saveStatistics", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(400).json({ message: "token not found" });

    const verify = jwt.verify(token, process.env.TOKEN_SECRET); //verify._id
    const userID = verify._id;

    const user = await User.findById(userID);
    if (!user) return res.status(400).json({ message: "user not found" });

    const test = await Test.findById(req.body.statisticTest.testID);
    if (!test) return res.status(400).json({ message: "test not found" });

    const testStatistic = new TestStatistics({
      userID,
      testID: req.body.statisticTest.testID,
      question: req.body.questionArray,
      result: req.body.statisticTest.result,
      date: req.body.statisticTest.date,
    });

    for (let i = 0; i < req.body.questionArray.length; i++) {
      const questionStatistic = new QuestionsStatistic({
        userID,
        testID: req.body.statisticTest.testID,
        questionID: req.body.questionArray[i].questionID,
        result: req.body.questionArray[i].result,
        date: req.body.statisticTest.date,
      });

      await questionStatistic.save();
    }
    await testStatistic.save();

    res.status(200).json({ message: "Query complet" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getQuestionStatistic/:id", verify, async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(400).json({ message: "token not found" });

    const question = await QuestionsStatistic.find({
      questionID: req.params.id,
    });

    res.status(200).json({ message: "Query complete", question });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

// loged student
router.get("/getMyStatistic", verify, async (req, res) => {
  try {
    const testStatistic = await TestStatistics.find({ userID: req.user._id });

    res.status(200).json({ message: "Query complet", testStatistic });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getStudentStatistic/:id", verify, async (req, res) => {
  try {
    const testStatistic = await TestStatistics.find({userID: req.params.id})

    res.status(200).json({message: "Query complet", testStatistic})
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
    
  }
})

module.exports = router;
