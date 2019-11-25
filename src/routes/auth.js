const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

const buildErrorResponse = error =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.post("/register", async (req, res) => {
  //LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = registerValidation(req.body);
  console.log("Error", error);
  if (error) {
    return res.status(400).send(buildErrorResponse(error));
  }

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist)
    return res.status(400).send({
      email: false,
      message: "Email address is already taken. Use another email adress"
    });

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    await user.save();
    res.send({ registration: true, message: "Registration completed" });
  } catch (err) {
    res.status(500).send("😅Something went wrong"); //Я не смог добраться до ошибки, понятия не имею что надо сделать не так
  }
});

//LOGIN
router.post("/login", verify, async (req, res) => {
  //Lets validate the data before wa a user
  //очень плохо что ты это отправляешь в body
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(buildErrorResponse(error));

  //Checking if the email exists
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Email is not found");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //token
  const activeUser = {
    id: user._id,
    name: user.name,
    email: user.email
  };

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(activeUser);
});
module.exports = router;
