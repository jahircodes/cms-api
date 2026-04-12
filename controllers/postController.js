/**
 * Post API: CRUD with client slug, author from JWT, and attached media IDs.
 */
const {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require('../services/postService');

const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.body, req.user.userId);
    const full = await getPostByIdService(post.id);
    res.status(201).json({ success: true, data: full });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { pageNo, pageSize, categoryId, status } = req.validatedQuery;
    const result = await getPostsService({
      pageNo,
      pageSize,
      categoryId,
      status,
    });
    res.json({
      success: true,
      data: result.posts,
      pagination: {
        pageNo: result.pageNo,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const post = await getPostByIdService(id);
    res.json({ success: true, data: post });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const result = await updatePostService(id, req.body);
    res.json({ success: true, message: result.message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const result = await deletePostService(id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
