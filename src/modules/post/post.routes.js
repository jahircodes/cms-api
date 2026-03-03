/**
 * Post Router
 * -----------
 * Defines post management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const { validate, createPostSchema, updatePostSchema } = require('./post.validator');

const buildPostRouter = ({ postController }) => {
  const router = Router();

  router.post('/', validate(createPostSchema), postController.createPost);
  router.get('/', postController.getPosts);
  router.get('/:id', postController.getPostById);
  router.put('/:id', validate(updatePostSchema), postController.updatePost);
  router.delete('/:id', postController.deletePost);

  return router;
};

module.exports = { buildPostRouter };
