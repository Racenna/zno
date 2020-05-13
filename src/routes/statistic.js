const router = require("express").Router();
const verify = require("./verifyToken");
// Joi
const { saveStatisticValidation } = require("../validation");
// Models
const Test = require("../model/Tests");
const TestStatistics = require("../model/TestStatistics");
const QuestionsStatistic = require("../model/QuestionsStatistic");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/getQuestionStatistic/:id", verify, async (req, res) => {
  try {
    const query = { questionID: req.params.id };

    const questions = await QuestionsStatistic.find(query);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getTestStatistics/:id", verify, async (req, res) => {
  try {
    const query = { testID: req.params.id };

    const testStatistic = await TestStatistics.find(query);

    res.status(200).json(testStatistic);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getMyStatistic", verify, async (req, res) => {
  try {
    const query = { userID: req.user._id };

    const testStatistic = await TestStatistics.find(query);

    res.status(200).json(testStatistic);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getStudentStatistic/:id", verify, async (req, res) => {
  try {
    const result = [];
    const query = { userID: req.params.id };

    await TestStatistics.find(query, (err, docs) => {
      if (err) return res.status(400).json({ status: "error" });

      docs.forEach((item) => {
        let correctAnswer = 0;
        item.questions.forEach((item) => {
          if (item.result === true) correctAnswer++;
        });

        let test = {
          _id: item._id,
          userID: item.userID,
          testID: item.testID,
          questions: item.questions,
          user: item.user,
          test: item.test,
          correctAnswer,
          result: item.result,
          date: item.date,
        };
        result.push(test);
      });
      return res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/saveStatistics", verify, async (req, res) => {
  try {
    const { error } = saveStatisticValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const query = req.body.statisticTest.test._id;

    const test = await Test.findById(query);
    if (!test) return res.status(400).json({ message: "test not found" });

    const testStatistic = new TestStatistics({
      user: {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        fathername: req.user.fathername,
        group: req.user.group,
        email: req.user.email,
      },
      userID: req.user._id,
      testID: req.body.statisticTest.test._id,
      test: {
        name: req.body.statisticTest.test.name,
        questions: req.body.statisticTest.test.questions,
        theme: req.body.statisticTest.test.theme,
        owner: req.body.statisticTest.test.owner,
      },
      questions: req.body.questionArray,
      result: req.body.statisticTest.result,
      date: req.body.statisticTest.date,
    });

    for (let i = 0; i < req.body.questionArray.length; i++) {
      const questionStatistic = new QuestionsStatistic({
        user: {
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          fathername: req.user.fathername,
          group: req.user.group,
          email: req.user.email,
        },
        userID: req.user._id,
        testID: req.body.statisticTest.test._id,
        questionID: req.body.questionArray[i].questionID,
        result: req.body.questionArray[i].result,
        date: req.body.statisticTest.date,
      });

      await questionStatistic.save();
    }
    await testStatistic.save();

    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
