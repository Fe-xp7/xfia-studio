import { Router } from 'express';
import * as controller from '../controllers/templateController.js';
import { validate } from '../middlewares/validate.js';
import { templateSchema } from '../validators/schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const templateRoutes = Router();
templateRoutes.get('/', asyncHandler(controller.listTemplates));
templateRoutes.post('/', validate(templateSchema), asyncHandler(controller.createTemplate));
templateRoutes.get('/:id', asyncHandler(controller.getTemplate));
templateRoutes.put('/:id', validate(templateSchema), asyncHandler(controller.updateTemplate));
templateRoutes.delete('/:id', asyncHandler(controller.deleteTemplate));
