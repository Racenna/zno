const router = require("express").Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// Joi
const { registerValidation, loginValidation } = require("../validation");
// Models
const User = require("../model/User");
const Group = require("../model/Group");
const HashedCodeSchema = require("../model/HashedCode");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/activate/:hashedCode", async (req, res) => {
  try {
    const verify = await HashedCodeSchema.findOne({
      hash: req.params.hashedCode,
    });

    await User.findByIdAndUpdate(
      { _id: verify.owner },
      {
        activateAccount: true,
      }
    );

    await HashedCodeSchema.findOneAndDelete({ owner: verify.owner });

    res.status(200).json("Реєстрація завершена");
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/verifyEmail", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) return res.status(200).json({ verify: true });

    res.status(200).json({ verify: false });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/getGroup", async (req, res) => {
  try {
    const groups = await Group.findOne({}, { _id: 0 });

    if (!groups)
      return res.status(400).json({ massage: "Групи не були знайдені" });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ massage: "😅Something went wrong" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist)
      return res.status(400).json({
        email: false,
        message: "Пошта вже використовується. Використайте іншу пошту",
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
      password: hashedPassword,
    });

    await User.init();

    await user.save();

    const userRegister = await User.findOne({ email: req.body.email });

    const hashedCode = crypto.randomBytes(10).toString("hex");

    const hashSchema = new HashedCodeSchema({
      hash: hashedCode,
      owner: userRegister._id,
    });

    await hashSchema.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
      },
    });

    transporter.verify((error, success) => {
      if (error) return console.log(error);
      console.log("Server is ready to take our messages: ", success);
      transporter.on("token", (token) => {
        console.log("A new access token was generated");
        console.log("User: %s", token.user);
        console.log("Access Token: %s", token.accessToken);
        console.log("Expires: %s", new Date(token.expires));
      });
    });

    const mailOptions = {
      from: `ZNO Android App <${process.env.EMAIL}>`,
      to: req.body.email,
      subject: "Підтвердження пошти",
      text: `Ласкаво просимо до Zno4Android! Натисніть на посилання:
      ${process.env.DOMAIN}/api/user/activate/${hashedCode}`,
      html: `<h4>Ласкаво просимо до Zno4Android! Натисніть на посилання</h4>
      <a href="${process.env.DOMAIN}/api/user/activate/${hashedCode}">Підтвердити</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json({
      registration: true,
      status: "ok",
    });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Невірно введені дані" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Невірно введені дані" });

    // Add a new valid session to the database
    const sessionId = crypto.randomBytes(32).toString("hex");
    user.sessions.push(sessionId);
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, sessionId },
      process.env.TOKEN_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
