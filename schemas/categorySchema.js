const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(180).required(),
  parentId: Joi.number().integer().allow(null),
  description: Joi.string().allow('', null),
  status: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().max(150).optional(),
  slug: Joi.string().max(180).optional(),
  parentId: Joi.number().integer().allow(null),
  description: Joi.string().allow('', null),
  status: Joi.boolean().optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
