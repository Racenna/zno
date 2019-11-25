//VALIDATION
const Joi = require("@hapi/joi");

//Register validation
const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      // .min(5) // REVIEW если есть валидация на email не нужно делать минимальную длину
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
  });
  return schema.validate(data, { abortEarly: false }); // REVIEW добавив этот флаг мы получим сразу все ошибки разом
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
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
