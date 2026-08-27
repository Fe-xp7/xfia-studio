import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, me } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../validators/schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRoutes = Router();
authRoutes.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }), validate(loginSchema), asyncHandler(login));
authRoutes.get('/me', authenticate, me);
