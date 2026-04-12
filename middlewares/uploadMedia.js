/**
 * Multer disk storage for media uploads under /uploads.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
]);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, name);
  },
});

const uploadMedia = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) {
      return cb(null, true);
    }
    const err = new Error('Only image uploads are allowed');
    err.statusCode = 400;
    cb(err);
  },
});

/**
 * Multer single-file middleware with JSON error responses.
 */
function uploadSingleFile(req, res, next) {
  uploadMedia.single('file')(req, res, (err) => {
    if (err) {
      const status = err.statusCode || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 400);
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large (max 10MB)'
          : err.message;
      return res.status(status).json({ success: false, message });
    }
    next();
  });
}

module.exports = {
  uploadMedia,
  uploadSingleFile,
  UPLOAD_DIR,
};
