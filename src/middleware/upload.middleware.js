const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'profiles');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // The file name is generated here; the client-supplied name is never used.
    filename: (req, file, cb) =>
      cb(null, `${req.user.id}-${crypto.randomBytes(8).toString('hex')}${EXTENSIONS[file.mimetype]}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    EXTENSIONS[file.mimetype] ? cb(null, true) : cb(new ApiError(400, 'Only JPG, PNG or WEBP images are allowed.')),
});

module.exports = upload;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
