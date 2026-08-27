import { Router } from 'express';
import * as controller from '../controllers/companyController.js';
import { validate } from '../middlewares/validate.js';
import { companySchema } from '../validators/schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const companyRoutes = Router();
companyRoutes.get('/', asyncHandler(controller.listCompanies));
companyRoutes.post('/', validate(companySchema), asyncHandler(controller.createCompany));
companyRoutes.post('/:id/analyze', asyncHandler(controller.analyzeCompany));
companyRoutes.post('/:id/generate-site', asyncHandler(controller.generateCompanySite));
companyRoutes.get('/:id', asyncHandler(controller.getCompany));
companyRoutes.put('/:id', validate(companySchema), asyncHandler(controller.updateCompany));
companyRoutes.delete('/:id', asyncHandler(controller.deleteCompany));
