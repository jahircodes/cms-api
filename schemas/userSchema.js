const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().integer().required(),
}).unknown(false); // Disallow unknown fields

module.exports = createUserSchema;
