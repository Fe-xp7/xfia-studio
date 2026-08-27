import { Router } from 'express';
import { imageUpload } from '../services/storage/index.js';
import { uploadImages } from '../controllers/uploadController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const uploadRoutes=Router();
uploadRoutes.post('/images',imageUpload.array('images',10),asyncHandler(uploadImages));
