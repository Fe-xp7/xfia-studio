import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { settingsSchema } from '../validators/schemas.js';

export const settingsRoutes = Router();
settingsRoutes.get('/', asyncHandler(getSettings));
settingsRoutes.put('/', validate(settingsSchema), asyncHandler(updateSettings));
