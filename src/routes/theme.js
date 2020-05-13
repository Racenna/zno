const router = require("express").Router();
const verify = require("./verifyToken");
// Joi
const { addThemeValidation, updateThemeValidation } = require("../validation");
// Models
const Theme = require("../model/Theme");

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
      return res.status(400).json({ message: "Only a teacher can add theme" });

    if (!req.user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const query = { theme: req.body.theme };

    const themeExist = await Theme.findOne(query);

    if (themeExist)
      return res.status(400).json({
        message: "theme is already exist.",
      });

    const theme = new Theme({
      theme: req.body.theme,
    });

    await theme.save();

    res.status(200).json("Theme created");
  } catch (error) {
    res.status(500).send({ message: "😅Something went wrong" });
  }
});

router.put("/updateTheme/:id", verify, async (req, res) => {
  try {
    const { error } = updateThemeValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theme" });

    if (!req.user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const query = { _id: req.params.id };

    const data = await Theme.findOne(query);

    data.theme = req.body.theme || data.theme;

    await data.save();

    res.status(200).json("Theme updated");
  } catch (error) {
    res.status(500).send({ message: "😅Something went wrong" });
  }
});

router.delete("/deleteTheme/:id", verify, async (req, res) => {
  try {
    if (req.user.status !== "Teacher")
      return res.status(400).json({ message: "Only a teacher can add theme" });

    if (!req.user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const query = { _id: req.params.id };

    await Theme.findOneAndDelete(query);

    res.status(200).json("Theme deleted");
  } catch (error) {
    res.status(500).send({ message: "😅Something went wrong" });
  }
});

module.exports = router;
