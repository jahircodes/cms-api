/**
 * Media API: multipart upload and metadata updates (all routes authenticated).
 */
const {
  createMediaFromUploadService,
  getMediaListService,
  getMediaByIdService,
  updateMediaService,
  deleteMediaService,
} = require('../services/mediaService');

const createMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required (multipart field name: file)',
      });
    }

    const media = await createMediaFromUploadService({
      file: req.file,
      altText: req.body.altText,
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};

const getMediaList = async (req, res, next) => {
  try {
    const { pageNo, pageSize } = req.validatedQuery;
    const result = await getMediaListService({ pageNo, pageSize });
    res.json({
      success: true,
      data: result.media,
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

const getMediaById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const media = await getMediaByIdService(id);
    res.json({ success: true, data: media });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const updateMedia = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const result = await updateMediaService(id, req.body);
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

const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const result = await deleteMediaService(id);
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
  createMedia,
  getMediaList,
  getMediaById,
  updateMedia,
  deleteMedia,
};
