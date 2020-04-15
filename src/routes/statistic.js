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
      name: test.name,
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

    res.status(200).json(testStatistic);
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

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

// loged student
router.get("/getMyStatistic", verify, async (req, res) => {
  try {
    const result = [];
    // const testStatistic =
    await TestStatistics.find({ userID: req.user._id }, (err, docs) => {
      if (err) throw err;
      docs.forEach((item) => {
        let correctAnswer = 0;
        item.question.forEach((item) => {
          if (item.result === true) correctAnswer++;
        });

        let test = {
          _id: item._id,
          test: {
            _id: item.testID,
            // userID: item.userID,
            // testID: item.testID,
            name: item.name,
            question: item.question,
            correctAnswer,
          },
          result: item.result,
          date: item.date,
        };
        result.push(test);
      });
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getStudentStatistic/:id", verify, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (user.status === "Student") {
      const result = [];
      await TestStatistics.find({ userID: req.params.id }, (err, docs) => {
        if (err) throw err;
        docs.forEach((item) => {
          let correctAnswer = 0;
          item.question.forEach((item) => {
            if (item.result === true) correctAnswer++;
          });

          let test = {
            _id: item._id,
            test: {
              _id: item.testID,
              // userID: item.userID,
              // testID: item.testID,
              name: item.name,
              question: item.question,
              correctAnswer,
            },
            result: item.result,
            date: item.date,
          };
          result.push(test);
        });
      });

      res.status(200).json(result);
      return;
    }

    if (user.status !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theory" });

    if (!user.verifyed) {
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });
    } else {
      const result = [];
      const userStatistic = await User.findById({ _id: req.params.id });
      await TestStatistics.find({ userID: req.params.id }, (err, docs) => {
        if (err) throw err;
        docs.forEach((item) => {
          let correctAnswer = 0;
          item.question.forEach((item) => {
            if (item.result === true) correctAnswer++;
          });

          let test = {
            _id: item._id,
            test: {
              _id: item.testID,
              // userID: item.userID,
              // testID: item.testID,
              name: item.name,
              question: item.question,
              correctAnswer,
            },
            user: {
              firstname: userStatistic.firstname,
              lastname: userStatistic.lastname,
              fathername: userStatistic.fathername,
              group: userStatistic.group,
              status: userStatistic.status,
              email: userStatistic.email,
            },
            result: item.result,
            date: item.date,
          };
          result.push(test);
        });
      });

      res.status(200).json(result);
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
