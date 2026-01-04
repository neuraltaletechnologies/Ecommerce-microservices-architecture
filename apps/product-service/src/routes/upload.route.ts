import express, { Router } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { shouldBeAdmin } from '../middleware/authMiddleware.js';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages,
} from '../controllers/upload.controller';

const router: Router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload single image
router.post('/upload', shouldBeAdmin, upload.single('image'), uploadImage);

// Upload multiple images
router.post('/upload-multiple', shouldBeAdmin, upload.array('images', 10), uploadImages);

// Delete single image
router.delete('/delete', shouldBeAdmin, deleteImage);

// Delete multiple images
router.delete('/delete-multiple', shouldBeAdmin, deleteImages);

export default router;
