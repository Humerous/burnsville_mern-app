import crypto from 'crypto';
import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const GRIDFS_BUCKET_NAME = 'productImages';
const STORED_IMAGE_NAME = /^[a-f0-9]{32}\.(?:jpg|png)$/;

const extensionForMimeType = (mimeType) =>
  mimeType === 'image/png' ? '.png' : '.jpg';

const getImageBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error('Image storage is unavailable');
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: GRIDFS_BUCKET_NAME,
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
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

const detectImageMimeType = (buffer) => {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  return null;
};

const storeImage = async (buffer, mimeType) => {
  const bucket = getImageBucket();
  const filename = `${crypto.randomBytes(16).toString('hex')}${extensionForMimeType(
    mimeType
  )}`;
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      contentType: mimeType,
    },
  });

  await new Promise((resolve, reject) => {
    uploadStream.once('error', reject);
    uploadStream.once('finish', resolve);
    uploadStream.end(buffer);
  });

  return filename;
};

export const serveUploadedImage = asyncHandler(async (req, res, next) => {
  const { filename } = req.params;

  if (!STORED_IMAGE_NAME.test(filename)) {
    next();
    return;
  }

  const bucket = getImageBucket();
  const imageFile = await bucket.find({ filename }).next();

  if (!imageFile) {
    res.status(404);
    throw new Error('Image not found');
  }

  res.set('Content-Type', imageFile.metadata?.contentType || 'application/octet-stream');
  res.set('Content-Length', String(imageFile.length));
  res.set('Cache-Control', 'public, max-age=31536000, immutable');

  const downloadStream = bucket.openDownloadStream(imageFile._id);

  await new Promise((resolve, reject) => {
    downloadStream.once('error', reject);
    res.once('finish', resolve);
    res.once('close', resolve);
    downloadStream.pipe(res);
  });
});

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

    const detectedMimeType = detectImageMimeType(req.file.buffer);

    if (!detectedMimeType || detectedMimeType !== req.file.mimetype) {
      res.status(400);
      throw new Error('Uploaded file is not a valid JPEG or PNG image');
    }

    const filename = await storeImage(req.file.buffer, detectedMimeType);
    res.status(201).send(`/uploads/${filename}`);
  })
);

export default router;
