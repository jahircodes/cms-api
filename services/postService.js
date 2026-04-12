/**
 * Post CRUD: client-provided slug (unique), author from session, attached media sync.
 */
const { Op } = require('sequelize');
const { sequelize, Post, User, Category, Media } = require('../models');
const { assertMediaIdsExist } = require('./mediaService');

const postListInclude = [
  {
    model: User,
    attributes: ['id', 'name', 'email'],
  },
  {
    model: Category,
    attributes: ['id', 'name', 'slug'],
  },
  {
    model: Media,
    as: 'featuredImage',
    attributes: ['id', 'url', 'altText'],
  },
];

const postDetailInclude = [
  ...postListInclude,
  {
    model: Media,
    as: 'attachedMedia',
    attributes: ['id', 'url', 'altText', 'filePath'],
    through: { attributes: [] },
  },
];

/**
 * Creates a post; slug from client; userId from authenticated user.
 * @param {object} payload
 * @param {number} userId
 */
const createPostService = async (payload, userId) => {
  const {
    categoryId,
    title,
    slug,
    contentJson,
    contentHtml,
    excerpt,
    featuredImageId,
    status,
    attachedMediaIds,
  } = payload;

  const category = await Category.findByPk(categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  if (featuredImageId != null) {
    const img = await Media.findByPk(featuredImageId);
    if (!img) {
      const error = new Error('Featured image not found');
      error.statusCode = 404;
      throw error;
    }
  }

  await assertMediaIdsExist(attachedMediaIds || []);

  const slugTaken = await Post.findOne({ where: { slug } });
  if (slugTaken) {
    const error = new Error('Slug already in use');
    error.statusCode = 409;
    throw error;
  }

  return sequelize.transaction(async (transaction) => {
    const post = await Post.create(
      {
        userId,
        categoryId,
        title,
        slug,
        contentJson,
        contentHtml,
        excerpt: excerpt === '' ? null : excerpt ?? null,
        featuredImageId: featuredImageId ?? null,
        status: status ?? 'DRAFT',
      },
      { transaction },
    );

    if (attachedMediaIds && attachedMediaIds.length > 0) {
      await post.setAttachedMedia(attachedMediaIds, { transaction });
    }

    return post;
  });
};

/**
 * Paginated posts with optional filters.
 * @param {{ pageNo: number, pageSize: number, categoryId?: number, status?: string }} params
 */
const getPostsService = async ({ pageNo, pageSize, categoryId, status }) => {
  const limit = pageSize;
  const offset = (pageNo - 1) * pageSize;

  const where = {};
  if (categoryId != null) {
    where.categoryId = categoryId;
  }
  if (status != null) {
    where.status = status;
  }

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: postListInclude,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  const totalPages = pageSize > 0 ? Math.ceil(count / pageSize) : 0;

  return {
    posts: rows,
    total: count,
    pageNo,
    pageSize,
    totalPages,
  };
};

const getPostByIdService = async (id) => {
  const post = await Post.findByPk(id, {
    include: postDetailInclude,
  });
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }
  return post;
};

/**
 * Updates a post; optional slug from client with uniqueness check.
 * @param {number|string} id
 * @param {object} payload
 */
const updatePostService = async (id, payload) => {
  const post = await Post.findByPk(id);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  if (payload.slug != null) {
    const existing = await Post.findOne({
      where: { slug: payload.slug, id: { [Op.ne]: id } },
    });
    if (existing) {
      const error = new Error('Slug already in use');
      error.statusCode = 409;
      throw error;
    }
  }

  if (payload.categoryId != null) {
    const category = await Category.findByPk(payload.categoryId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'featuredImageId')) {
    if (payload.featuredImageId != null) {
      const img = await Media.findByPk(payload.featuredImageId);
      if (!img) {
        const error = new Error('Featured image not found');
        error.statusCode = 404;
        throw error;
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'attachedMediaIds')) {
    await assertMediaIdsExist(payload.attachedMediaIds || []);
  }

  return sequelize.transaction(async (transaction) => {
    const updates = { ...payload };

    if (Object.prototype.hasOwnProperty.call(updates, 'excerpt')) {
      updates.excerpt =
        updates.excerpt === '' ? null : updates.excerpt ?? null;
    }

    delete updates.attachedMediaIds;

    const fields = [
      'categoryId',
      'title',
      'slug',
      'contentJson',
      'contentHtml',
      'excerpt',
      'featuredImageId',
      'status',
    ];
    const patch = {};
    for (const key of fields) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        patch[key] = updates[key];
      }
    }

    if (Object.keys(patch).length > 0) {
      await post.update(patch, { transaction });
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'attachedMediaIds')) {
      await post.setAttachedMedia(payload.attachedMediaIds || [], {
        transaction,
      });
    }

    return { message: 'Post updated successfully' };
  });
};

const deletePostService = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  await post.destroy();
  return { message: 'Post deleted successfully' };
};

module.exports = {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
};
