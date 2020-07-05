const router = require("express").Router();
const verify = require("./verifyToken");
// Joi
const { createTestValidation, updateTestValidation } = require("../validation");
// Models
const Tests = require("../model/Tests");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/getTest", verify, async (req, res) => {
  try {
    const query = { _id: req.query._id };

    const test = await Tests.findOne(query);

    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getAllTest", verify, async (req, res) => {
  try {
    const test = await Tests.find();

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getTestByTheme", verify, async (req, res) => {
  try {
    const query = { theme: req.query.theme };

    const test = await Tests.find(query);

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/checkOwner/:id", verify, async (req, res) => {
  try {
    const test = await Tests.findById(req.params.id);

    if (req.user._id.toString() !== test.owner.toString()) {
      return res.status(403).json(`У вас немає прав на цю функцію`);
    }

    res.status(200).json({ message: `ok` });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/createTest", verify, async (req, res) => {
  try {
    const { error } = createTestValidation(req.body.test);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Тільки вчитель може створювати тест" });

    if (!req.user.verified)
      return res.status(400).json({
        message:
          "Ви не маєте доступу до цієї функції. Зв'яжіться з розробником для отримання доступу.",
      });

    const test = new Tests({
      name: req.body.test.name,
      theme: req.body.test.theme,
      questions: req.body.test.questions,
      owner: req.user._id,
    });

    await test.save();

    res.status(200).json({ message: "Тест створено" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/updateTestById/:id", verify, async (req, res) => {
  try {
    const { error } = updateTestValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const query = { _id: req.params.id };

    const test = await Tests.findById(query);

    if (req.user._id.toString() !== test.owner.toString()) {
      return res
        .status(403)
        .json({ message: "у вас немає прав на цю функцію" });
    } else {
      test.name = req.body.name || test.name;
      test.theme = req.body.theme || test.theme;
      test.questions = req.body.questions || test.questions;

      await test.save();

      return res.status(200).json({ message: "Дані оновлено" });
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.delete("/deleteTestById/:id", verify, async (req, res) => {
  try {
    const query = { _id: req.params.id };

    const test = await Tests.findById(query);

    if (req.user._id.toString() !== test.owner.toString()) {
      return res
        .status(403)
        .json({ message: "у вас немає прав на цю функцію" });
    } else {
      await Tests.deleteOne(query);
      return res.status(200).json({ message: `Тест видалено` });
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
