const Joi = require('joi');
const { ApiError } = require('../../shared/ApiError');

const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new ApiError('Validation failed', 400, error.details));
  }
  req.body = value;
  return next();
};

module.exports = { validate, updateUserSchema };
