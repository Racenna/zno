const router = require("express").Router();
const verify = require("./verifyToken");
// Joi
const { addThemeValidation, updateThemeValidation } = require("../validation");
// Models
const Theme = require("../model/Theme");
const Tests = require("../model/Tests");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/getAllThemes", verify, async (req, res) => {
  try {
    const theme = await Theme.find();

    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/addTheme", verify, async (req, res) => {
  try {
    const { error } = addThemeValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Тільки вчителя можуть додавати теми" });

    if (!req.user.verified)
      return res.status(400).json({
        message:
          "Ви не маєте доступу до цієї функції. Зв'яжіться з розробником для отримання доступу.",
      });

    const query = { theme: req.body.theme };

    const themeExist = await Theme.findOne(query);

    if (themeExist)
      return res.status(400).json({
        message: "Тема вже існує.",
      });

    const theme = new Theme({
      theme: req.body.theme,
    });

    await theme.save();

    res.status(200).json({ message: "Тема створена" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/updateTheme/:id", verify, async (req, res) => {
  try {
    const { error } = updateThemeValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Тільки вчителя можуть оновлювати тему" });

    if (!req.user.verified)
      return res.status(400).json({
        message:
          "Ви не маєте доступу до цієї функції. Зв'яжіться з розробником для отримання доступу.",
      });

    const query = { _id: req.params.id };

    const data = await Theme.findOne(query);

    if (req.body.theme !== data.theme) {
      if (req.body.theme === "") {
        req.body.theme = data.theme;
      }

      await Tests.updateMany(
        { theme: data.theme },
        { $set: { theme: req.body.theme } }
      );

      data.theme = req.body.theme;

      await data.save();

      return res.status(200).json({ message: "Тему змінено" });
    } else {
      return res.status(200).json({ message: "Тему змінено" });
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.delete("/deleteTheme/:id", verify, async (req, res) => {
  try {
    if (req.user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Тільки вчителя можуть видаляти теми" });

    if (!req.user.verified)
      return res.status(400).json({
        message:
          "Ви не маєте доступу до цієї функції. Зв'яжіться з розробником для отримання доступу.",
      });

    const query = { _id: req.params.id };

    await Theme.findOneAndDelete(query);

    res.status(200).json({ message: "Тема видалена" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
