/**
 * Joi schemas for media list query, create body (multipart alt text), and update body.
 */
const Joi = require('joi');

const getMediaQuerySchema = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

const createMediaBodySchema = Joi.object({
  altText: Joi.string().max(255).allow('', null),
}).unknown(false);

const updateMediaSchema = Joi.object({
  altText: Joi.string().max(255).allow('', null).required(),
}).unknown(false);

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

module.exports = {
  getMediaQuerySchema,
  createMediaBodySchema,
  updateMediaSchema,
  idParamSchema,
};
