const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

function validateCategory(data) {
  return categorySchema.validate(data);
}

module.exports = { validateCategory };
