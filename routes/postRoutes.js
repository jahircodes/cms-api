/**
 * Post routes (all protected): CRUD with attachedMediaIds on create/update.
 */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const validate = require('../middlewares/validator');
const { postController } = require('../controllers');
const {
  getPostsQuerySchema,
  createPostSchema,
  updatePostSchema,
  idParamSchema,
} = require('../schemas/postSchema');

router.get(
  '/',
  authenticateToken,
  validate(getPostsQuerySchema, 'query'),
  postController.getPosts,
);
router.get(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  postController.getPostById,
);
router.post(
  '/',
  authenticateToken,
  validate(createPostSchema, 'body'),
  postController.createPost,
);
router.put(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  validate(updatePostSchema, 'body'),
  postController.updatePost,
);
router.delete(
  '/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  postController.deletePost,
);

module.exports = router;
