/**
 * Media routes (all protected): upload, list, get, update alt text, delete.
 */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const validate = require('../middlewares/validator');
const { uploadSingleFile } = require('../middlewares/uploadMedia');
const { mediaController } = require('../controllers');
const {
  getMediaQuerySchema,
  createMediaBodySchema,
  updateMediaSchema,
  idParamSchema,
} = require('../schemas/mediaSchema');

router.get(
  '/',
  authenticateToken,
  validate(getMediaQuerySchema, 'query'),
  mediaController.getMediaList,
);
router.get(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  mediaController.getMediaById,
);
router.post(
  '/',
  authenticateToken,
  uploadSingleFile,
  validate(createMediaBodySchema, 'body'),
  mediaController.createMedia,
);
router.put(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  validate(updateMediaSchema, 'body'),
  mediaController.updateMedia,
);
router.delete(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  mediaController.deleteMedia,
);

module.exports = router;
