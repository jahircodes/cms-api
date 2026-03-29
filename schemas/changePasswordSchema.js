const Joi = require('joi');

const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
}).unknown(false);

module.exports = changePasswordSchema;
