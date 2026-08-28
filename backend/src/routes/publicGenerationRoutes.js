import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/publicGenerationController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { publicGenerationSchema } from '../validators/schemas.js';
import { imageUpload } from '../services/storage/index.js';

export const publicGenerationRoutes = Router();
const generationLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const pollingLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });
publicGenerationRoutes.post('/sites/generate', generationLimit, imageUpload.array('images',5), validate(publicGenerationSchema), asyncHandler(controller.createGenerationJob));
publicGenerationRoutes.get('/jobs/:token', pollingLimit, asyncHandler(controller.getGenerationJob));
