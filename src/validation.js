//VALIDATION
const Joi = require("@hapi/joi");

//Register validation
const registerValidation = data => {
  const schema = Joi.object({
    firstname: Joi.string()
      .min(3)
      .required(),
    lastname: Joi.string()
      .min(3)
      .required(),
    fathername: Joi.string()
      .min(3)
      .required(),
    group: Joi.string().allow(""),
    status: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
