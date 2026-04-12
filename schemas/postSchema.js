/**
 * Joi schemas for post create/update bodies, list query, and id param.
 */
const Joi = require('joi');

const getPostsQuerySchema = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  categoryId: Joi.number().integer().positive(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED'),
}).unknown(false);

const createPostSchema = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
  title: Joi.string().trim().min(1).max(255).required(),
  slug: Joi.string().trim().min(1).max(255).required(),
  contentJson: Joi.any().required(),
  contentHtml: Joi.string().required(),
  excerpt: Joi.string().allow('', null),
  featuredImageId: Joi.number().integer().positive().allow(null),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED'),
  attachedMediaIds: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
}).unknown(false);

const updatePostSchema = Joi.object({
  categoryId: Joi.number().integer().positive(),
  title: Joi.string().trim().min(1).max(255),
  slug: Joi.string().trim().min(1).max(255),
  contentJson: Joi.any(),
  contentHtml: Joi.string(),
  excerpt: Joi.string().allow('', null),
  featuredImageId: Joi.number().integer().positive().allow(null),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED'),
  attachedMediaIds: Joi.array().items(Joi.number().integer().positive()),
})
  .min(1)
  .unknown(false);

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

module.exports = {
  getPostsQuerySchema,
  createPostSchema,
  updatePostSchema,
  idParamSchema,
};
