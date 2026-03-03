/**
 * Post Controller
 * ---------------
 * Handles HTTP logic for post management endpoints.
 * Uses dependency injection for testability and decoupling.
 */

const { sendSuccess } = require('../../utils/response');

const buildPostController = ({ postService }) => {
  const createPost = async (req, res, next) => {
    try {
      const data = { ...req.body, userId: req.user.sub };
      const result = await postService.createPost(data);
      return sendSuccess(res, result, 'Post created');
    } catch (err) {
      next(err);
    }
  };

  const getPosts = async (req, res, next) => {
    try {
      const result = await postService.getPosts();
      return sendSuccess(res, result, 'Posts retrieved');
    } catch (err) {
      next(err);
    }
  };

  const getPostById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await postService.getPostById(+id);
      return sendSuccess(res, result, 'Post retrieved');
    } catch (err) {
      next(err);
    }
  };

  const updatePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await postService.updatePost(+id, data);
      return sendSuccess(res, result, 'Post updated');
    } catch (err) {
      next(err);
    }
  };

  const deletePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await postService.deletePost(+id);
      return sendSuccess(res, result, 'Post deleted');
    } catch (err) {
      next(err);
    }
  };

  return {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
  };
};

module.exports = { buildPostController };
