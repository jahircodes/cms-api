/**
 * Media CRUD: disk-backed uploads with public URL and safe delete when unreferenced.
 */
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');
const { Media, Post, PostMedia } = require('../models');

const PROJECT_ROOT = path.join(__dirname, '..');

/**
 * Public base URL for building file URLs (no trailing slash).
 * @returns {string}
 */
function getPublicBaseUrl() {
  const base =
    process.env.APP_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
  return base.replace(/\/$/, '');
}

/**
 * Persists an uploaded file row and returns the created media.
 * @param {{ file: Express.Multer.File, altText?: string | null }} params
 */
const createMediaFromUploadService = async ({ file, altText }) => {
  const relativePath = path.posix.join('uploads', file.filename);
  const url = `${getPublicBaseUrl()}/${relativePath}`;

  const media = await Media.create({
    url,
    filePath: relativePath,
    altText: altText === '' ? null : altText ?? null,
  });

  return media;
};

/**
 * Paginated media list (newest first).
 * @param {{ pageNo: number, pageSize: number }} params
 */
const getMediaListService = async ({ pageNo, pageSize }) => {
  const limit = pageSize;
  const offset = (pageNo - 1) * pageSize;

  const { count, rows } = await Media.findAndCountAll({
    attributes: ['id', 'url', 'filePath', 'altText', 'createdAt'],
    limit,
    offset,
    order: [['id', 'DESC']],
  });

  const totalPages = pageSize > 0 ? Math.ceil(count / pageSize) : 0;

  return {
    media: rows,
    total: count,
    pageNo,
    pageSize,
    totalPages,
  };
};

const getMediaByIdService = async (id) => {
  const media = await Media.findByPk(id, {
    attributes: ['id', 'url', 'filePath', 'altText', 'createdAt'],
  });
  if (!media) {
    const error = new Error('Media not found');
    error.statusCode = 404;
    throw error;
  }
  return media;
};

const updateMediaService = async (id, { altText }) => {
  const media = await Media.findByPk(id);
  if (!media) {
    const error = new Error('Media not found');
    error.statusCode = 404;
    throw error;
  }

  await media.update({
    altText: altText === '' ? null : altText,
  });

  return { message: 'Media updated successfully' };
};

/**
 * Deletes media file on disk and row if not referenced by posts.
 * @param {number|string} id
 */
const deleteMediaService = async (id) => {
  const media = await Media.findByPk(id);
  if (!media) {
    const error = new Error('Media not found');
    error.statusCode = 404;
    throw error;
  }

  const featuredCount = await Post.count({
    where: { featuredImageId: id },
  });
  const attachmentCount = await PostMedia.count({
    where: { mediaId: id },
  });

  if (featuredCount > 0 || attachmentCount > 0) {
    const error = new Error(
      'Media is in use by a post (featured image or attachment) and cannot be deleted',
    );
    error.statusCode = 409;
    throw error;
  }

  if (media.filePath) {
    const absPath = path.join(PROJECT_ROOT, media.filePath);
    try {
      await fs.unlink(absPath);
    } catch (unlinkErr) {
      if (unlinkErr.code !== 'ENOENT') {
        throw unlinkErr;
      }
    }
  }

  await media.destroy();
  return { message: 'Media deleted successfully' };
};

/**
 * Ensures all IDs exist in media table (for post payloads).
 * @param {number[]} ids
 */
const assertMediaIdsExist = async (ids) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const unique = [...new Set(ids)];
  const found = await Media.findAll({
    where: { id: { [Op.in]: unique } },
    attributes: ['id'],
  });
  if (found.length !== unique.length) {
    const error = new Error('One or more media IDs are invalid');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  createMediaFromUploadService,
  getMediaListService,
  getMediaByIdService,
  updateMediaService,
  deleteMediaService,
  assertMediaIdsExist,
};
