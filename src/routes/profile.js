const router = require("express").Router();
const verify = require("./verifyToken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// Joi
const {
  changePassValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateUserDataValidation,
} = require("../validation");
// Models
const User = require("../model/User");
const HashedCodeSchema = require("../model/HashedCode");

const buildErrorResponse = (error) =>
  error.details.reduce((resp, detail) => {
    console.log(detail);
    return { ...resp, [detail.path.join(".")]: detail.message };
  }, {});

router.get("/getUserData", verify, async (req, res) => {
  try {
    const activeUser = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      fathername: req.user.fathername,
      image: req.user.image,
      email: req.user.email,
      group: req.user.group,
      status: req.user.status,
      verifyed: req.user.verifyed,
      activateAccount: req.user.activateAccount,
    };

    res.status(200).json(activeUser);
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/verifyTeacher", verify, async (req, res) => {
  try {
    const hashedCode = crypto.randomBytes(10).toString("hex");

    const hashSchema = new HashedCodeSchema({
      hash: hashedCode,
      owner: req.user._id,
    });

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
      from: `${req.user.lastname} ${req.user.firstname} ${req.user.fathername} <${req.user.email}>`,
      to: process.env.EMAIL,
      subject: "Verification teacher as trusted teacher",
      text: `${req.user.email} 
      Hello, I'm ${req.user.lastname} ${req.user.firstname} ${req.user.fathername}, I want to get access to teacher feature
      click this link to verify this teacher ${process.env.DOMAIN}/api/profile/activate/teacher/${hashedCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    await hashSchema.save();

    res.status(200).json("ok");
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.get("/activate/teacher/:hashedCode", async (req, res) => {
  try {
    const verify = await HashedCodeSchema.findOne({
      hash: req.params.hashedCode,
    });

    await User.findByIdAndUpdate(
      { _id: verify.owner },
      {
        verifyed: true,
      }
    );

    await HashedCodeSchema.findOneAndDelete({ owner: verify.owner });

    res.status(200).send("Аккаунт підтверджено ");
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const query = {
      email: req.body.email,
    };

    const user = await User.findOne(query);
    if (user) {
      // Create a password reset token that expires in 6 hours
      user.resetPasswordToken = crypto.randomBytes(3).toString("hex");
      user.resetPasswordTokenExpires = Date.now() + 2.16e7;
      await user.save();

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
        subject: "Forgot password",
        text: ``,
        html: `
        <div>
          <h3>Confirmation code</h3>
          <p>Copy confirmation code and paste into the appropriate field in the application:</p>
          <b>${user.resetPasswordToken}</b>
        </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      console.log(
        `New reset token for ${user.email}: ${user.resetPasswordToken}`
      );

      res
        .status(200)
        .json({ message: "Please check your email inbox and spam folder" });
    } else {
      res
        .status(200)
        .json({ message: "Please check your email inbox and spam folder" });
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { error } = resetPasswordValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const query = {
      resetPasswordToken: req.body.resetPasswordToken,
      resetPasswordTokenExpires: {
        $gte: Date.now(),
      },
    };

    const user = await User.findOne(query);

    if (user) {
      const salt = await bcrypt.genSalt(10);
      console.log(req.body);
      const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = hashedNewPassword;
      await user.save();

      user.resetPasswordToken = null;
      user.resetPasswordTokenExpires = Date.now();
      await user.save();

      user.sessions = [];
      await user.save();

      res.status(200).json(`Password for ${user.email} successfully reset`);
    } else {
      res
        .status(400)
        .json("This password reset link is either expired or invalid");
    }
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.post("/signout", verify, async (req, res) => {
  try {
    req.user.sessions = [];
    await req.user.save();

    res.status(200).json({ message: "Signed out from all sessions" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/updateUserData", verify, async (req, res) => {
  try {
    const { error } = updateUserDataValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    req.user.firstname = req.body.firstname || req.user.firstname;
    req.user.lastname = req.body.lastname || req.user.lastname;
    req.user.fathername = req.body.fathername || req.user.fathername;
    req.user.image = req.body.image || req.user.image;

    req.user.save();

    res.status(200).json({ message: "User data was updated" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

router.put("/changePassword", verify, async (req, res) => {
  try {
    const { error } = changePassValidation(req.body);
    if (error) return res.status(400).json(buildErrorResponse(error));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.oldPassword,
      req.user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Old password is not correct" });

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

    req.user.password = hashedNewPassword;
    await req.user.save();

    res.status(200).json({ status: `ok`, message: "Updated your password" });
  } catch (error) {
    res.status(500).json({ message: "😅Something went wrong" });
  }
});

module.exports = router;
