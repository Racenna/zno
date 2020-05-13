const router = require("express").Router();
const verify = require("./verifyToken");
// Joi
const {
  addTheoryValidation,
  updateTheoryValidation,
} = require("../validation");
// Models
const Theory = require("../model/Theory");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/", verify, async (req, res) => {
  try {
    const query = { theme: req.query.theme };
    const theory = await Theory.find(query);

    res.status(200).json(theory);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/add", verify, async (req, res) => {
  try {
    const { error } = addTheoryValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res.status(403).json({ message: "Only a teacher can add theory" });

    if (!req.user.verifyed)
      return res.status(403).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const theory = new Theory({
      theme: req.body.theme,
      name: req.body.name,
      text: req.body.text,
      image: req.body.image || "",
    });

    await theory.save();

    res.status(200).json({ message: "Theory added" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/update/:id", verify, async (req, res) => {
  try {
    const { error } = updateTheoryValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    if (req.user.status !== "Teacher")
      return res
        .status(400)
        .json({ message: "Only a teacher can change theory" });

    if (!req.user.verifyed)
      return res.status(400).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    const query = { _id: req.params.id };

    const theory = await Theory.findOne(query);

    if (!theory) return res.status(400).json({ message: "Theory not found" });

    theory.theme = req.body.theme || theory.theme;
    theory.name = req.body.name || theory.name;
    theory.text = req.body.text || theory.text;
    theory.image = req.body.image || theory.image;

    await theory.save();

    res.status(200).json(`Theory updated`);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.delete("/delete/:id", verify, async (req, res) => {
  try {
    if (req.user.status !== "Teacher")
      return res.status(403).json({ message: "Only a teacher can add theory" });

    if (!req.user.verifyed)
      return res.status(403).json({
        message:
          "You don't have access to this feature. Contact the admins for access.",
      });

    await Theory.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json(`Теорію видалено`);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
