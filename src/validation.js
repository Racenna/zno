//VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).required().messages({
      "string.base": `"firstname" повинно будти строкою`,
      "string.min": `"firstname" повинно мати не менше {#limit}`,
      "string.required": `"firstname" обов'язкове поле`,
    }),
    lastname: Joi.string().min(3).required().messages({
      "string.base": `"lastname" повинно будти строкою`,
      "string.min": `"lastname" повинно мати не менше {#limit}`,
      "string.required": `"lastname" обов'язкове поле`,
    }),
    fathername: Joi.string().min(3).required().messages({
      "string.base": `"fathername" повинно будти строкою`,
      "string.min": `"fathername" повинно мати не менше {#limit}`,
      "string.required": `"fathername" обов'язкове поле`,
    }),
    group: Joi.string().allow(""),
    status: Joi.string().required().messages({
      "string.base": `"status" повинно будти строкою`,
      "string.required": `"status" обов'язкове поле`,
    }),
    email: Joi.string().required().email().messages({
      "string.base": `"email" повинно будти строкою`,
      "string.email": `"email" повинно будти поштою`,
      "string.required": `"email" обов'язкове поле`,
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": `"password" повинно будти строкою`,
      "string.min": `"password" повинно мати не менше {#limit}`,
      "string.required": `"password" обов'язкове поле`,
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.base": `"email" повинно будти строкою`,
      "string.email": `"email" повинно будти поштою`,
      "string.required": `"email" обов'язкове поле`,
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": `"password" повинно будти строкою`,
      "string.min": `"password" повинно мати не менше {#limit}`,
      "string.required": `"password" обов'язкове поле`,
    }),
  });
  return schema.validate(data);
};

const changePassValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(8).required().messages({
      "string.base": `"oldPassword" повинно будти строкою`,
      "string.min": `"oldPassword" повинно мати не менше {#limit}`,
      "string.required": `"oldPassword" обов'язкове поле`,
    }),
    newPassword: Joi.string().min(8).required().messages({
      "string.base": `"newPassword" повинно будти строкою`,
      "string.min": `"newPassword" повинно мати не менше {#limit}`,
      "string.required": `"newPassword" обов'язкове поле`,
    }),
  });
  return schema.validate(data);
};

const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.base": `"email" повинно будти строкою`,
      "string.email": `"email" повинно будти поштою`,
      "string.required": `"email" обов'язкове поле`,
    }),
  });
  return schema.validate(data);
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    resetPasswordToken: Joi.string().required().messages({
      "string.base": `"resetPasswordToken" повинно будти строкою`,
      "string.required": `"resetPasswordToken" обов'язкове поле`,
    }),
    newPassword: Joi.string().min(8).required().messages({
      "string.base": `"newPassword" повинно будти строкою`,
      "string.min": `"newPassword" повинно мати не менше {#limit}`,
      "string.required": `"newPassword" обов'язкове поле`,
    }),
  });
  return schema.validate(data);
};

const updateUserDataValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).allow("").messages({
      "string.base": `"firstname" повинно будти строкою`,
      "string.min": `"firstname" повинно мати не менше {#limit}`,
      "string.required": `"firstname" обов'язкове поле`,
    }),
    lastname: Joi.string().min(3).allow("").messages({
      "string.base": `"lastname" повинно будти строкою`,
      "string.min": `"lastname" повинно мати не менше {#limit}`,
      "string.required": `"lastname" обов'язкове поле`,
    }),
    fathername: Joi.string().min(3).allow("").messages({
      "string.base": `"fathername" повинно будти строкою`,
      "string.min": `"fathername" повинно мати не менше {#limit}`,
      "string.required": `"fathername" обов'язкове поле`,
    }),
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
      // Удаилить затычку для клиента
      user: Joi.object(),
    }),
  });
  return schema.validate(data);
};

const createTestValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": `"name" повинно будти строкою`,
      "string.required": `"name" обов'язкове поле`,
    }),
    theme: Joi.string().required().messages({
      "string.base": `"theme" повинно будти строкою`,
      "string.required": `"theme" обов'язкове поле`,
    }),
    questions: Joi.array().items({
      theme: Joi.string().required().messages({
        "string.base": `"theme" повинно будти строкою`,
        "string.required": `"theme" обов'язкове поле`,
      }),
      questionType: Joi.string().required().messages({
        "string.base": `"questionType" повинно будти строкою`,
        "string.required": `"questionType" обов'язкове поле`,
      }),
      images: Joi.array().min(0).max(3).required(),
      text: Joi.string().required().messages({
        "string.base": `"text" повинно будти строкою`,
        "string.required": `"text" обов'язкове поле`,
      }),
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
    theme: Joi.string().required().messages({
      "string.base": `"theme" повинно будти строкою`,
      "string.required": `"theme" обов'язкове поле`,
    }),
  });
  return schema.validate(data);
};

const updateThemeValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().allow("").required().messages({
      "string.base": `"theme" повинно будти строкою`,
      "string.required": `"theme" обов'язкове поле (може будти порожнім)`,
    }),
  });
  return schema.validate(data);
};

const addTheoryValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().required().messages({
      "string.base": `"theme" повинно будти строкою`,
      "string.required": `"theme" обов'язкове поле`,
    }),
    name: Joi.string().required().messages({
      "string.base": `"name" повинно будти строкою`,
      "string.required": `"name" обов'язкове поле`,
    }),
    text: Joi.string().required().messages({
      "string.base": `"text" повинно будти строкою`,
      "string.required": `"text" обов'язкове поле`,
    }),
    files: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": `"files element" повинно будти строкою`,
        })
      )
      .messages({
        "array.base": `"files" повинно будти масивом`,
      }),
  });
  return schema.validate(data);
};

const updateTheoryValidation = (data) => {
  const schema = Joi.object({
    theme: Joi.string().allow("").messages({
      "string.base": `"theme" повинно будти строкою`,
    }),
    name: Joi.string().allow("").messages({
      "string.base": `"name" повинно будти строкою`,
    }),
    text: Joi.string().allow("").messages({
      "string.base": `"text" повинно будти строкою`,
    }),
    files: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": `"files element" повинно будти строкою`,
        })
      )
      .messages({
        "array.base": `"files" повинно будти масивом`,
      }),

    // Удаилить затычку для клиента
    _id: Joi.string(),
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
