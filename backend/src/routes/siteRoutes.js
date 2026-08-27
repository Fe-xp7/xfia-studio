import { Router } from 'express';
import * as controller from '../controllers/siteController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const siteRoutes=Router();
siteRoutes.get('/',asyncHandler(controller.listSites));
siteRoutes.get('/:id',asyncHandler(controller.getSite));
siteRoutes.put('/:id',asyncHandler(controller.updateSite));
siteRoutes.post('/:id/deploy',asyncHandler(controller.deploySite));
siteRoutes.delete('/:id',asyncHandler(controller.deleteSite));
