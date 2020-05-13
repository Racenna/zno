//VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    fathername: Joi.string().min(3).required(),
    group: Joi.string().allow(""),
    status: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const changePassValidation = (data) => {
  const schema = Joi.object({
    oldPass: Joi.string().min(8).required(),
    newPass: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });
  return schema.validate(data);
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    resetPasswordToken: Joi.string().required(),
    newPassword: Joi.string().required(),
  });
  return schema.validate(data);
};

const updateUserDataValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).allow(""),
    lastname: Joi.string().min(3).allow(""),
    fathername: Joi.string().min(3).allow(""),
    image: Joi.string().allow(""),
  });
  return schema.validate(data);
};

const saveStatisticValidation = (data) => {
  const schema = Joi.object({
    questionArray: Joi.array().items({
      questionID: Joi.string().required(),
      result: Joi.boolean().required(),
    }),
    statisticTest: Joi.object({
      date: Joi.string().required(),
      result: Joi.number().required(),
      test: Joi.object({
        name: Joi.string().required(),
        theme: Joi.string().required(),
        owner: Joi.string().required(),
        _id: Joi.string().required(),
        questions: Joi.array().items({
          correct: Joi.array().min(1).required(),
          images: Joi.array().min(0).required(),
          text: Joi.string().required(),
          theme: Joi.string().required(),
          questionType: Joi.string().required(),
          variants: Joi.array().min(0).required(),
          _id: Joi.string().required(),
        }),
      }),
    }),
  });
  return schema.validate(data);
};

const createTestValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    theme: Joi.string().required(),
    questions: Joi.array().items({
      theme: Joi.string().required(),
      questionType: Joi.string().required(),
      images: Joi.array().min(0).max(3).required(),
      text: Joi.string().required(),
      variants: Joi.array().min(0).required(),
      correct: Joi.array().min(0).required(),
    }),
  });
  return schema.validate(data);
};

const updateTestValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    theme: Joi.string(),
    questions: Joi.array().items({
      theme: Joi.string(),
      questionType: Joi.string(),
      images: Joi.array().max(3),
      text: Joi.string(),
      variants: Joi.array(),
      correct: Joi.array(),
    }),
  });
  return schema.validate(data);
};

const addThemeValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().required(),
  });
  return schema.validate(data);
};

const updateThemeValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().allow("").required(),
  });
  return schema.validate(data);
};

const addTheoryValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().required(),
    name: Joi.string().required(),
    text: Joi.string().required(),
    image: Joi.string().allow(""),
  });
  return schema.validate(data);
};

const updateTheoryValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string(),
    name: Joi.string(),
    text: Joi.string(),
    image: Joi.string().allow(""),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changePassValidation = changePassValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.updateUserDataValidation = updateUserDataValidation;
module.exports.saveStatisticValidation = saveStatisticValidation;
module.exports.createTestValidation = createTestValidation;
module.exports.updateTestValidation = updateTestValidation;
module.exports.addThemeValidation = addThemeValidation;
module.exports.updateThemeValidation = updateThemeValidation;
module.exports.addTheoryValidation = addTheoryValidation;
module.exports.updateTheoryValidation = updateTheoryValidation;
