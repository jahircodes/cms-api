/**
 * Post Router
 * -----------
 * Defines post management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const {
  validate,
  validateQuery,
  createPostSchema,
  updatePostSchema,
  searchQuerySchema,
} = require('./post.validator');

const buildPostRouter = ({ postController }) => {
  const router = Router();

  router.get('/search', validateQuery(searchQuerySchema), postController.searchPosts);
  router.post('/', validate(createPostSchema), postController.createPost);
  router.get('/', postController.getPosts);
  router.get('/:id', postController.getPostById);
  router.put('/:id', validate(updatePostSchema), postController.updatePost);
  router.delete('/:id', postController.deletePost);

  return router;
};

module.exports = { buildPostRouter };
