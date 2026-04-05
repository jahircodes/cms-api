/**
 * Request body validation for the logged-in user password update endpoint.
 */
const Joi = require('joi');

const userPasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
}).unknown(false);

module.exports = userPasswordSchema;
