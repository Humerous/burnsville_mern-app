import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIR = path.resolve('uploads');
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

const extensionForMimeType = (mimeType) =>
  mimeType === 'image/png' ? '.png' : '.jpg';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${extensionForMimeType(file.mimetype)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE,
    files: 1,
  },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG and PNG images are allowed'));
      return;
    }

    cb(null, true);
  },
});

const uploadSingleImage = (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413);
      next(new Error('Image must be 5 MB or smaller'));
      return;
    }

    res.status(400);
    next(new Error(error.message || 'Invalid image upload'));
  });
};

const detectImageMimeType = async (filePath) => {
  const handle = await fs.open(filePath, 'r');

  try {
    const header = Buffer.alloc(8);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);

    if (
      bytesRead >= 8 &&
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47 &&
      header[4] === 0x0d &&
      header[5] === 0x0a &&
      header[6] === 0x1a &&
      header[7] === 0x0a
    ) {
      return 'image/png';
    }

    if (
      bytesRead >= 3 &&
      header[0] === 0xff &&
      header[1] === 0xd8 &&
      header[2] === 0xff
    ) {
      return 'image/jpeg';
    }

    return null;
  } finally {
    await handle.close();
  }
};

const removeUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

router.post(
  '/',
  protect,
  admin,
  uploadSingleImage,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file received');
    }

    const detectedMimeType = await detectImageMimeType(req.file.path);

    if (!detectedMimeType || detectedMimeType !== req.file.mimetype) {
      await removeUploadedFile(req.file.path);
      res.status(400);
      throw new Error('Uploaded file is not a valid JPEG or PNG image');
    }

    res.status(201).send(`/uploads/${req.file.filename}`);
  })
);

export default router;
