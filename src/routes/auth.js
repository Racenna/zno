const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Group = require("../model/Group");

const buildErrorResponse = error =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.post("/register", async (req, res) => {
  try {
    const { error } = registerValidation(req.body);

    if (error) return res.status(400).json(buildErrorResponse(error));

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist)
      return res.status(400).json({
        email: false,
        message: "Email address is already taken. Use another email adress"
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      fathername: req.body.fathername,
      group: req.body.group || "no group",
      status: req.body.status,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res
      .status(200)
      .json({ registration: true, message: "Registration completed" });
  } catch (err) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Wrong data" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: "Wrong data" });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    const activeUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      fathername: user.fathername,
      group: user.group,
      status: user.status,
      token: token
    };

    res.status(200).json(activeUser);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/verifyEmail", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) return res.status(400).json({ verify: true });

    res.status(200).json({ verify: false });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getGroup", async (req, res) => {
  try {
    const groups = await Group.findOne({}, { _id: 0 });

    if (!groups) return res.status(400).json({ massage: "Groups not found" });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ massage: "😅Something went wrong" });
  }
});

module.exports = router;
